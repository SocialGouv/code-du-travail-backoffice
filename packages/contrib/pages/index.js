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

  componentDidMount() {
    const select = "select=*,question(value),labor_agreement(idcc,name)";
    const filter = "labor_agreement.idcc=in.(0016,1351,1596,1597,3043)";
    customAxios()
      .get(`http://localhost:3200/answers?${select}&${filter}`)
      .then(({ data }) => {
        this.setState({
          answers: data.filter(
            ({ labor_agreement }) => labor_agreement !== null
          ),
          isLoading: false
        });
      })
      .catch(console.warn);
  }

  editAnswer(answerId) {
    Router.push(`/answer/${answerId}`);
  }

  getContent() {
    switch (true) {
      case this.state.answers.length === 0:
        return <p>Fetching answers...</p>;

      default:
        return (
          <Flex flexDirection="column" width={1}>
            <Title first>Mes réponses en cours de rédaction</Title>
            {this.getAnswers(({ value }) => value.length > 0, true)}
            <Title>Réponses à rédiger</Title>
            {this.getAnswers(({ value }) => value.length === 0, false)}
          </Flex>
        );
    }
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
    return <Main>{this.getContent()}</Main>;
  }
}
