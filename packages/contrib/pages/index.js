import axios from "axios";
import styled from "styled-components";
import React from "react";
import Router from "next/router";

import Main from "../src/layouts/main";
import Login from "../src/components/login";

const Row = styled.div`
  cursor: pointer;
`;

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
      const select = "select=*,question(value),labor_agreements(name)";
      axios
        .get(`http://localhost:3200/answers?${select}`)
        .then(({ data }) => {
          this.answers = data;
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
        return this.getAnswers();
    }
  }

  getAnswers() {
    return this.answers.map(answer => (
      <Row key={answer.id} onClick={() => this.editAnswer(answer.id)}>
        <b>{answer.question.value}</b>
        <pre>{answer.value}</pre>
      </Row>
    ));
  }

  render() {
    return <Main>{this.getContent()}</Main>;
  }
}
