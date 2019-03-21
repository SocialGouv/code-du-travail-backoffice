import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Answer from "../src/blocks/Answer";
import Title from "../src/elements/Title";
import Main from "../src/layouts/Main";
import customAxios from "../src/libs/customAxios";

const Content = styled(Flex)`
  overflow-y: auto;
  padding: 0 1rem 0.5rem;
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

  editAnswer(answerId) {
    Router.push(`/answer/${answerId}`);
  }

  getAnswers(filter, isDraft) {
    const answers = this.state.answers.filter(filter);

    return answers.length === 0 ? (
      <p>Aucune réponse trouvée.</p>
    ) : (
      answers
        .slice(0, 10)
        .map(answer => (
          <Answer
            data={answer}
            label={isDraft ? "Brouillon" : "À rédiger"}
            key={answer.id}
            onClick={() => this.editAnswer(answer.id)}
          />
        ))
    );
  }

  render() {
    if (this.state.isLoading) return <Main isLoading />;

    return (
      <Main>
        <Content flexDirection="column" width={1}>
          <Title>Mes réponses en cours de rédaction</Title>
          {this.getAnswers(({ value }) => value.length > 0, true)}
          <Title>Réponses à rédiger</Title>
          {this.getAnswers(({ value }) => value.length === 0, false)}
        </Content>
      </Main>
    );
  }
}
