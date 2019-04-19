import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Answer from "../src/blocks/Answer";
import Subtitle from "../src/elements/Subtitle";
import Main from "../src/layouts/Main";
import customAxios from "../src/libs/customAxios";
import makeApiFilter from "../src/libs/makeApiFilter";

const Content = styled(Flex)`
  overflow-y: auto;
  padding: 0 1rem 0.5rem;
`;
const InfoText = styled.p`
  color: var(--color-dark-slate-gray);
  margin-bottom: 0.5rem;
`;
const HelpText = styled.p`
  color: var(--color-shadow);
  font-size: 0.875rem;
  font-style: italic;
  margin-bottom: 0.5rem;
`;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      isLoading: true,
      isSaving: false
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    await this.loadAnswers();
  }

  async loadAnswers() {
    this.setState({ isLoading: true });

    try {
      const { data: answers } = await this.axios.get(`/contributor_answers`);
      this.setState({
        answers,
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  /**
   * Cancel an answer draft by resettinng all its related data.
   */
  async cancelAnswer(id) {
    this.setState({ isLoading: true });

    const answersUri = `/answers?id=eq.${id}`;
    const answersData = { generic_reference: null, user_id: null, value: "" };
    const answersTagsUri = makeApiFilter("/answers_tags", {
      answer_id: id
    });
    const answersReferencesUri = makeApiFilter("/answers_references", {
      answer_id: id
    });

    await this.axios.delete(answersReferencesUri).catch(console.warn);
    await this.axios.delete(answersTagsUri).catch(console.warn);
    await this.axios.patch(answersUri, answersData).catch(console.warn);

    await this.loadAnswers();
  }

  /**
   * Update an answer to make it generic.
   *
   * @description
   * A generic answer can fallback to either Labor Code or its parent national
   * agreement text.
   */
  async fallbackAnswer(id, generic_reference) {
    this.setState({ isLoading: true });

    const uri = `/answers?id=eq.${id}`;
    const data = { generic_reference, value: "" };

    await this.axios.patch(uri, data).catch(console.warn);

    await this.loadAnswers();
  }

  editAnswer(id) {
    Router.push(
      {
        pathname: "/answer",
        query: { id }
      },
      `/answer/${id}`
    );
  }

  getAnswers(isDraft = false) {
    const filter = isDraft
      ? ({ generic_reference, value }) =>
          generic_reference !== null || value.length > 0
      : ({ generic_reference, value }) =>
          generic_reference === null && value.length === 0;
    const answers = this.state.answers.filter(filter);

    if (answers.length === 0) {
      return isDraft ? (
        <InfoText>
          {`Vous n'avez pas encore commencé à rédiger de réponses.`}
        </InfoText>
      ) : (
        <InfoText>
          {`Il n'y a pour l'instant (plus) auncune réponse à rédiger.`}
        </InfoText>
      );
    }

    return [
      isDraft ? (
        <HelpText key="help">
          Sélectionnez une réponse pour la modifier:
        </HelpText>
      ) : (
        <HelpText key="help">
          Sélectionnez une question pour commencer à rédiger une réponse:
        </HelpText>
      ),
      answers
        .slice(0, 10)
        .map(answer => [
          <Answer
            data={answer}
            isDraft={isDraft}
            key={answer.id}
            onCancel={this.cancelAnswer.bind(this)}
            onClick={this.editAnswer.bind(this)}
            onFallback={this.fallbackAnswer.bind(this)}
          />
        ])
    ];
  }

  render() {
    if (this.state.isLoading) return <Main isLoading />;

    return (
      <Main>
        <Content flexDirection="column" width={1}>
          <Subtitle>Mes réponses en cours de rédaction</Subtitle>
          {this.getAnswers(true)}
          <Subtitle>Réponses à rédiger</Subtitle>
          {this.getAnswers()}
        </Content>
      </Main>
    );
  }
}
