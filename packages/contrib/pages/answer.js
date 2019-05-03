import axios from "axios";
import debounce from "lodash.debounce";
import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import AnswerEditionContent from "../src/blocks/AnswerEditionContent";
import AnswerEditionHead from "../src/blocks/AnswerEditionHead";
import AnswerEditionReferences from "../src/blocks/AnswerEditionReferences";
import Main from "../src/layouts/Main";
import SavingSpinner from "../src/elements/SavingSpinner";
import customAxios from "../src/libs/customAxios";
import makeApiFilter from "../src/libs/makeApiFilter";
import { TABS } from "../src/blocks/AnswerEditionHead/Tabs";

const Container = styled(Main)`
  overflow-x: hidden;
`;
const Content = styled(Flex)`
  flex-grow: 1;
  overflow-y: auto;
`;
const ContentInfo = styled(Flex)`
  color: var(--color-black-leather-jacket);
  font-size: 1rem;
  margin-top: 0.5rem;
  position: absolute;
  right: 1rem;
  width: 13rem;
`;

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: TABS.EDITOR,
      isLoading: true,
      isSaving: false,
      lastAnswerValue: ""
    };

    this.allTags = [];
    this.originalAnswer = null;

    this.deleteReference = debounce(this._deleteReference.bind(this), 500);
    this.insertReference = debounce(this._insertReference.bind(this), 500);
    this.deleteTag = debounce(this._deleteTag.bind(this), 500);
    this.insertTag = debounce(this._insertTag.bind(this), 500);
    this.saveAnswerValue = debounce(this._saveAnswerValue.bind(this), 500);
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  componentDidMount() {
    this.axios = customAxios();

    const myAnswersFilter = `id=eq.${this.props.id}`;

    Promise.all([
      this.axios.get(`/tags`),
      this.axios.get(`/contributor_answers?${myAnswersFilter}`),
      axios.get(`/static/data/labor-law-references.json`)
    ])
      .then(([tagsRes, answersRes, laborCodeReferencesRes]) => {
        this.allTags = tagsRes.data;
        this.laborCodeReferences = laborCodeReferencesRes.data;
        this.originalAnswer = answersRes.data[0];

        this.setState({
          isLoading: false,
          lastAnswerValue: this.originalAnswer.value
        });
      })
      .catch(console.warn);
  }

  toggleTag(id, isAdded) {
    if (isAdded) {
      this.insertTag(id);
    } else {
      this.deleteTag(id);
    }
  }

  async cancelAnswer() {
    this.setState({ isSaving: true });

    const answersUri = `/answers?id=eq.${this.props.id}`;
    const answersData = {
      generic_reference: null,
      state: "todo",
      user_id: null,
      value: ""
    };
    const answersTagsUri = makeApiFilter("/answers_tags", {
      answer_id: this.props.id
    });
    const answersReferencesUri = makeApiFilter("/answers_references", {
      answer_id: this.props.id
    });

    await this.axios.delete(answersReferencesUri).catch(console.warn);
    await this.axios.delete(answersTagsUri).catch(console.warn);
    await this.axios.patch(answersUri, answersData).catch(console.warn);

    Router.push("/");
  }

  async _saveAnswerValue(value) {
    this.setState({ isSaving: true });

    const uri = `/answers?id=eq.${this.props.id}`;
    // An answer can't have a value and be generic at the same time:
    const data = { generic_reference: null, state: "draft", value };

    await this.axios.patch(uri, data).catch(console.warn);

    this.originalAnswer.value = value;
    this.setState({ isSaving: false });
  }

  async _insertTag(tagId) {
    this.setState({ isSaving: true });

    const answersUri = `/answers?id=eq.${this.props.id}`;
    // An answer can't have a custom tag and be generic at the same time:
    const answersData = {
      generic_reference: null,
      state: "draft"
    };
    const answersTagsUri = `/answers_tags`;
    const answersTagsData = {
      answer_id: this.props.id,
      tag_id: tagId
    };

    await this.axios.patch(answersUri, answersData).catch(console.warn);
    await this.axios.post(answersTagsUri, answersTagsData).catch(console.warn);

    this.setState({ isSaving: false });
  }

  async _deleteTag(tagId) {
    this.setState({ isSaving: true });

    const uri = makeApiFilter("/answers_tags", {
      answer_id: this.props.id,
      tag_id: tagId
    });

    await this.axios.delete(uri).catch(console.warn);

    this.setState({ isSaving: false });
  }

  async _insertReference(reference) {
    this.setState({ isSaving: true });

    const answersUri = `/answers?id=eq.${this.props.id}`;
    // An answer can't have a reference and be generic at the same time:
    const answersData = {
      generic_reference: null,
      state: "draft"
    };
    const answersReferencesUri = `/answers_references`;
    const answersReferencesData = {
      answer_id: this.props.id,
      ...reference
    };

    await this.axios.patch(answersUri, answersData).catch(console.warn);
    await this.axios
      .post(answersReferencesUri, answersReferencesData)
      .catch(console.warn);

    this.originalAnswer.references = [
      ...this.originalAnswer.references,
      reference
    ];
    this.setState({ isSaving: false });
  }

  async _deleteReference(_value) {
    this.setState({ isSaving: true });

    const uri = makeApiFilter("/answers_references", {
      answer_id: this.props.id,
      value: _value
    });

    await this.axios.delete(uri).catch(console.warn);

    this.originalAnswer.references = this.originalAnswer.references.filter(
      ({ value }) => value !== _value
    );
    this.setState({ isSaving: false });
  }

  switchTab(nextTab) {
    if (nextTab === this.state.currentTab) return;

    this.setState({
      currentTab: nextTab,
      lastAnswerValue: this.originalAnswer.value
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

      case TABS.EDITOR:
      default:
        return (
          <AnswerEditionContent
            defaultValue={this.state.lastAnswerValue}
            onChange={this.saveAnswerValue}
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
          onCancel={() => this.cancelAnswer()}
          onTabChange={this.switchTab.bind(this)}
          title={this.originalAnswer.question}
        />
        <Content>
          {this.state.currentTab === TABS.EDITOR && this.state.isSaving && (
            <ContentInfo alignItems="center" justifyContent="space-between">
              <SavingSpinner
                color="var(--color-black-leather-jacket)"
                size="26"
              />
              Sauvegarde en cours…
            </ContentInfo>
          )}

          {this.getTabContent()}
        </Content>
      </Container>
    );
  }
}
