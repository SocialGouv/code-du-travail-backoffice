import axios from "axios";
import Router from "next/router";
import React from "react";
import { Flex } from "rebass";

import Answer from "../src/components/Answer";
import Login from "../src/components/Login";
import Title from "../src/elements/Title";
import Main from "../src/layouts/Main";

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
      isLoading: true
    };

    this.answers = [];

    this.forceUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentDidUpdate() {
    if (this.isAutenticated() && this.state.isLoading) {
      const select = "select=*,question(value),labor_agreement(idcc,name)";
      const filter = "labor_agreement.idcc=in.(0016,1351,1596,1597,3043)";
      axios
        .get(`http://localhost:3200/answers?${select}&${filter}`)
        .then(({ data }) => {
          this.answers = data.filter(
            ({ labor_agreement }) => labor_agreement !== null
          );
          this.setState({ isLoading: false });
        })
        .catch(console.warn);
    }
  }

  isAutenticated() {
    const jwt = sessionStorage.getItem("jwt");

    return typeof jwt === "string" && jwt.length > 0;
  }

  editAnswer(answerId) {
    Router.push(`/answer/${answerId}`);
  }

  getContent() {
    switch (true) {
      case !this.state.isMounted:
        return <p>Loading...</p>;

      case !this.isAutenticated():
        return <Login onLog={() => this.forceUpdate()} />;

      case this.state.isLoading:
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
    return this.answers
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
