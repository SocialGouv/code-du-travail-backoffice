import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Answer from "../src/blocks/Answer";
import Subtitle from "../src/elements/Subtitle";
import Main from "../src/layouts/Main";
import customAxios from "../src/libs/customAxios";

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
      isLoading: true
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

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
      ? ({ value }) => value.length > 0
      : ({ value }) => value.length === 0;
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
            label={isDraft ? "Brouillon" : "À rédiger"}
            key={answer.id}
            onClick={() => this.editAnswer(answer.id)}
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
