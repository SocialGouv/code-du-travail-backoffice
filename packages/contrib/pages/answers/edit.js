import axios from "axios";
import debounce from "lodash.debounce";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";
import styled from "styled-components";

import * as actions from "../../src/actions";
import AnswerEditionContent from "../../src/blocks/AnswerEditionContent";
import AnswerEditionHead from "../../src/blocks/AnswerEditionHead";
import AnswerEditionReferences from "../../src/blocks/AnswerEditionReferences";
import AnswerEditionTags from "../../src/blocks/AnswerEditionTags";
import Main from "../../src/layouts/Main";
import SavingSpinner from "../../src/elements/SavingSpinner";
import customAxios from "../../src/libs/customAxios";
import getCurrentUser from "../../src/libs/getCurrentUser";
import makeApiFilter from "../../src/libs/makeApiFilter";
import { TABS } from "../../src/blocks/AnswerEditionHead/Tabs";
import { ANSWER_STATE } from "../../src/constants";

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

class AnswersEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: TABS.EDITOR,
      hasSavingSpinner: false,
      isLoading: true,
      isSaving: false,
      me: null,
      references: [],
      savingSpinnerTimeout: 0,
      tags: []
    };

    this.allTags = [];
    this.prevalue = null;
    this.newPrevalue = null;

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
    const { id } = this.props;
    const me = getCurrentUser();

    this.axios = customAxios();
    this.fetchAnswer();

    try {
      const { data: references } = await this.axios.get(
        `/answers_references?answer_id=eq.${id}`
      );
      const { data: tags } = await this.axios.get(`/answers_tags`);
      const { data: allTags } = await this.axios.get(`/tags`);
      const laborCodeReferences = await axios.get(
        `/static/data/labor-law-references.json`
      );

      this.allTags = allTags;
      this.laborCodeReferences = laborCodeReferences.data;

      this.setState({
        isLoading: false,
        me,
        references,
        tags
      });
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidUpdate() {
    if (!this.props.answers.isLoading) {
      if (this.prevalue === null) {
        this.prevalue = this.props.answers.data.prevalue;
        this.newPrevalue = this.props.answers.data.prevalue;
        this.forceUpdate();
      }
    }
  }

  fetchAnswer() {
    const { dispatch, id } = this.props;

    dispatch(actions.answers.loadOne(id));
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

    this.props.dispatch(
      actions.modal.open(
        `Êtes-vous sûr d'annuler cette réponse (son contenu sera supprimé) ?`,
        () =>
          actions.answers.cancel([this.props.id], () =>
            Router.push("/answers/draft/1")
          )
      )
    );
  }

  async requestForAnswerValidation() {
    if (this.state.isSaving) return;

    this.props.dispatch(
      actions.modal.open(
        `Êtes-vous sûr d'envoyer cette réponse en validation ?`,
        () =>
          actions.answers.setState(
            [this.props.id],
            ANSWER_STATE.PENDING_REVIEW,
            () => Router.push("/answers/draft/1")
          )
      )
    );
  }

  async _saveAnswerPrevalue(value) {
    this.setState({ isSaving: true });
    this.showSavingSpinner();

    try {
      const uri = `/answers?id=eq.${this.props.id}`;
      const data = {
        prevalue: value,
        state: "draft",
        user_id: this.state.me.id
      };

      await this.axios.patch(uri, data);
      this.newPrevalue = value;
    } catch (err) {
      console.warn(err);
    }

    this.setState({ isSaving: false });
  }

  async _insertTag(tagId) {
    this.setState({ isSaving: true });

    try {
      const answersUri = `/answers?id=eq.${this.props.id}`;
      const answersData = {
        state: "draft",
        user_id: this.state.me.id
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

    this.setState({
      isSaving: false,
      tags: [...this.state.tags, tagId]
    });
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

    this.setState({
      isSaving: false,
      tags: this.state.tags.filter(id => id !== tagId)
    });
  }

  async _insertReference(reference) {
    this.setState({ isSaving: true });

    try {
      const answersUri = `/answers?id=eq.${this.props.id}`;
      const answersData = {
        state: "draft",
        user_id: this.state.me.id
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

    this.setState({
      isSaving: false,
      references: [...this.state.references, reference]
    });
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

    this.setState({
      isSaving: false,
      references: this.state.references.filter(({ value }) => value !== _value)
    });
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

    if (nextTab === TABS.EDITOR) {
      this.prevalue = this.newPrevalue;
    }

    this.setState({ currentTab: nextTab });
  }

  getTabContent() {
    const { prevalue } = this;
    const { references, tags } = this.state;

    switch (this.state.currentTab) {
      case TABS.REFERENCES:
        return (
          <AnswerEditionReferences
            laborCodeReferences={this.laborCodeReferences}
            onAdd={this.insertReference.bind(this)}
            onRemove={this.deleteReference.bind(this)}
            references={references}
          />
        );

      case TABS.TAGS:
        return (
          <AnswerEditionTags
            onToggle={this.toggleTag.bind(this)}
            selectedTags={tags}
            tags={this.allTags}
          />
        );

      case TABS.EDITOR:
      default:
        return (
          <AnswerEditionContent
            defaultValue={prevalue}
            onChange={this.saveAnswerPrevalue}
          />
        );
    }
  }

  render() {
    const { prevalue } = this;
    const { answers } = this.props;
    const { isLoading, references, tags } = this.state;

    if (isLoading || answers.isLoading || prevalue === null) {
      return <Main isLoading />;
    }

    const { agreement, question } = answers.data;

    return (
      <Container>
        <AnswerEditionHead
          agreement={agreement}
          currentTab={this.state.currentTab}
          idcc={agreement.idcc}
          index={agreement.index}
          onCancel={() => this.cancelAnswer()}
          onSubmit={() => this.requestForAnswerValidation()}
          onTabChange={this.switchTab.bind(this)}
          question={question}
          referencesCount={references.length}
          tagsCount={tags.length}
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

export default connect(({ answers }) => ({ answers }))(AnswersEditPage);
