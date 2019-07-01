import axios from "axios";
import debounce from "lodash.debounce";
import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import AnswerEditionContent from "../../src/blocks/AnswerEditionContent";
import AnswerEditionHead from "../../src/blocks/AnswerEditionHead";
import AnswerEditionReferences from "../../src/blocks/AnswerEditionReferences";
import AnswerEditionTags from "../../src/blocks/AnswerEditionTags";
import Main from "../../src/layouts/Main";
import SavingSpinner from "../../src/elements/SavingSpinner";
import customAxios from "../../src/libs/customAxios";
import makeApiFilter from "../../src/libs/makeApiFilter";
import { TABS } from "../../src/blocks/AnswerEditionHead/Tabs";

const Container = styled(Main)`
  overflow-x: hidden;
`;
const Content = styled(Flex)`
  flex-grow: 1;
  overflow-y: auto;
`;
const ContentInfo = styled(Flex)`
  color: var(--color-shadow);
  font-size: 1rem;
  margin-top: 0.5rem;
  position: absolute;
  right: 1rem;
  width: 12.5rem;
`;

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: TABS.EDITOR,
      hasSavingSpinner: false,
      isLoading: true,
      isSaving: false,
      lastAnswerPrevalue: "",
      me: null,
      savingSpinnerTimeout: 0
    };

    this.allTags = [];
    this.originalAnswer = null;

    this.deleteReference = debounce(this._deleteReference.bind(this), 500);
    this.insertReference = debounce(this._insertReference.bind(this), 500);
    this.deleteTag = debounce(this._deleteTag.bind(this), 500);
    this.insertTag = debounce(this._insertTag.bind(this), 500);
    this.saveAnswerPrevalue = debounce(
      this._saveAnswerPrevalue.bind(this),
      500
    );
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  async componentDidMount() {
    this.setState({ me: JSON.parse(sessionStorage.getItem("me")) });

    this.axios = customAxios();

    try {
      const tags = await this.axios.get(`/tags`);
      const answers = await this.axios.get(
        `/contributor_answers?id=eq.${this.props.id}`
      );
      const laborCodeReferences = await axios.get(
        `/static/data/labor-law-references.json`
      );

      this.allTags = tags.data;
      this.laborCodeReferences = laborCodeReferences.data;
      this.originalAnswer = answers.data[0];

      this.setState({
        isLoading: false,
        lastAnswerPrevalue: this.originalAnswer.prevalue
      });
    } catch (err) {
      console.warn(err);
    }
  }

  toggleTag(id, isAdded) {
    if (isAdded) {
      this.insertTag(id);
    } else {
      this.deleteTag(id);
    }
  }

  async cancelAnswer() {
    if (this.state.isSaving) return;
    this.setState({ isSaving: true });

    try {
      const answersUri = `/answers?id=eq.${this.props.id}`;
      const answersData = {
        generic_reference: null,
        state: "todo",
        user_id: null,
        prevalue: ""
      };
      const answersTagsUri = makeApiFilter("/answers_tags", {
        answer_id: this.props.id
      });
      const answersReferencesUri = makeApiFilter("/answers_references", {
        answer_id: this.props.id
      });

      await this.axios.delete(answersReferencesUri);
      await this.axios.delete(answersTagsUri);
      await this.axios.patch(answersUri, answersData);

      Router.push("/");
    } catch (err) {
      console.warn(err);
    }
  }

  async requestForAnswerValidation() {
    if (this.state.isSaving) return;
    this.setState({ isSaving: true });

    try {
      const uri = `/answers?id=eq.${this.props.id}`;
      const data = {
        state: "pending_review",
        user_id: this.state.me.payload.id
      };

      await this.axios.patch(uri, data);

      Router.push("/");
    } catch (err) {
      console.warn(err);
    }
  }

  async _saveAnswerPrevalue(value) {
    this.setState({ isSaving: true });
    this.showSavingSpinner();

    try {
      const uri = `/answers?id=eq.${this.props.id}`;
      // An answer can't have a value and be generic at the same time:
      const data = {
        generic_reference: null,
        prevalue: value,
        state: "draft",
        user_id: this.state.me.payload.id
      };

      await this.axios.patch(uri, data);

      this.originalAnswer.prevalue = value;
    } catch (err) {
      console.warn(err);
    }

    this.setState({ isSaving: false });
  }

  async _insertTag(tagId) {
    this.setState({ isSaving: true });

    try {
      const answersUri = `/answers?id=eq.${this.props.id}`;
      // An answer can't have a custom tag and be generic at the same time:
      const answersData = {
        generic_reference: null,
        state: "draft",
        user_id: this.state.me.payload.id
      };
      const answersTagsUri = `/answers_tags`;
      const answersTagsData = {
        answer_id: this.props.id,
        tag_id: tagId
      };

      await this.axios.patch(answersUri, answersData);
      await this.axios.post(answersTagsUri, answersTagsData);
    } catch (err) {
      console.warn(err);
    }

    this.originalAnswer.tags = [...this.originalAnswer.tags, tagId];

    this.setState({ isSaving: false });
  }

  async _deleteTag(tagId) {
    this.setState({ isSaving: true });

    try {
      const uri = makeApiFilter("/answers_tags", {
        answer_id: this.props.id,
        tag_id: tagId
      });

      await this.axios.delete(uri);
    } catch (err) {
      console.warn(err);
    }

    this.originalAnswer.tags = this.originalAnswer.tags.filter(
      id => id !== tagId
    );

    this.setState({ isSaving: false });
  }

  async _insertReference(reference) {
    this.setState({ isSaving: true });

    try {
      const answersUri = `/answers?id=eq.${this.props.id}`;
      // An answer can't have a reference and be generic at the same time:
      const answersData = {
        generic_reference: null,
        state: "draft",
        user_id: this.state.me.payload.id
      };
      const answersReferencesUri = `/answers_references`;
      const answersReferencesData = {
        answer_id: this.props.id,
        ...reference
      };

      await this.axios.patch(answersUri, answersData);
      await this.axios.post(answersReferencesUri, answersReferencesData);
    } catch (err) {
      console.warn(err);
    }

    this.originalAnswer.references = [
      ...this.originalAnswer.references,
      reference
    ];

    this.setState({ isSaving: false });
  }

  async _deleteReference(_value) {
    this.setState({ isSaving: true });

    try {
      const uri = makeApiFilter("/answers_references", {
        answer_id: this.props.id,
        value: _value
      });

      await this.axios.delete(uri);
    } catch (err) {
      console.warn(err);
    }

    this.originalAnswer.references = this.originalAnswer.references.filter(
      ({ value }) => value !== _value
    );

    this.setState({ isSaving: false });
  }

  showSavingSpinner() {
    if (this.state.hasSavingSpinner) {
      clearTimeout(this.state.savingSpinnerTimeout);
    }

    this.setState({
      hasSavingSpinner: true,
      savingSpinnerTimeout: setTimeout(
        () =>
          this.setState({
            hasSavingSpinner: false,
            savingSpinnerTimeout: 0
          }),
        2000
      )
    });
  }

  switchTab(nextTab) {
    if (nextTab === this.state.currentTab) return;

    this.setState({
      currentTab: nextTab,
      lastAnswerPrevalue: this.originalAnswer.prevalue
    });
  }

  getTabContent() {
    switch (this.state.currentTab) {
      case TABS.REFERENCES:
        return (
          <AnswerEditionReferences
            laborCodeReferences={this.laborCodeReferences}
            onAdd={this.insertReference.bind(this)}
            onRemove={this.deleteReference.bind(this)}
            references={this.originalAnswer.references}
          />
        );

      case TABS.TAGS:
        return (
          <AnswerEditionTags
            onToggle={this.toggleTag.bind(this)}
            selectedTags={this.originalAnswer.tags}
            tags={this.allTags}
          />
        );

      case TABS.EDITOR:
      default:
        return (
          <AnswerEditionContent
            defaultValue={this.state.lastAnswerPrevalue}
            onChange={this.saveAnswerPrevalue}
            onToggleTag={this.toggleTag.bind(this)}
            selectedTags={this.originalAnswer.tags}
            tags={this.allTags}
          />
        );
    }
  }

  render() {
    if (this.state.isLoading) return <Main isLoading />;

    return (
      <Container>
        <AnswerEditionHead
          agreement={this.originalAnswer.agreement}
          currentTab={this.state.currentTab}
          idcc={this.originalAnswer.idcc}
          index={this.originalAnswer.index}
          onCancel={() => this.cancelAnswer()}
          onSubmit={() => this.requestForAnswerValidation()}
          onTabChange={this.switchTab.bind(this)}
          referencesCount={this.originalAnswer.references.length}
          tagsCount={this.originalAnswer.tags.length}
          title={this.originalAnswer.question}
        />
        <Content>
          {this.state.hasSavingSpinner && (
            <ContentInfo alignItems="center" justifyContent="space-between">
              <SavingSpinner color="var(--color-shadow)" size="26" />
              Sauvegarde en cours…
            </ContentInfo>
          )}

          {this.getTabContent()}
        </Content>
      </Container>
    );
  }
}
