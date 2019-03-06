import Router from "next/router";
import React from "react";
import { Flex } from "rebass";

import Answer from "../src/blocks/Answer";
import Title from "../src/elements/Title";
import Main from "../src/layouts/Main";
import customAxios from "../src/lib/customAxios";

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: []
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    try {
      const { data: answers } = await this.axios.get(`/my_answers`);
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
    return this.state.answers
      .filter(filter)
      .slice(0, 10)
      .map(answer => (
        <Answer
          data={answer}
          label={isDraft ? "Brouillon" : "À rédiger"}
          key={answer.id}
          onClick={() => this.editAnswer(answer.id)}
        />
      ));
  }

  render() {
    if (this.state.answers.length === 0) return <Main isLoading />;

    return (
      <Main>
        <Flex flexDirection="column" width={1}>
          <Title first>Mes réponses en cours de rédaction</Title>
          {this.getAnswers(({ value }) => value.length > 0, true)}
          <Title>Réponses à rédiger</Title>
          {this.getAnswers(({ value }) => value.length === 0, false)}
        </Flex>
      </Main>
    );
  }
}
