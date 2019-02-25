import axios from "axios";
import styled from "styled-components";
import React from "react";
import Router from "next/router";

import Main from "../../../src/layouts/Main";

const Row = styled.div`
  border: dashed 1px grey;
  cursor: pointer;
  font-weight: 600;
  margin: 0.5rem;
  padding: 0.5rem;
`;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.questions = [];
  }

  componentDidMount() {
    if (this.state.isLoading) {
      const select = "select=*";
      axios
        .get(`http://localhost:3200/questions?${select}&limit=10`)
        .then(({ data }) => {
          this.questions = data;
          this.setState({ isLoading: false });
        })
        .catch(console.warn);
    }
  }

  editQuestion(questionId) {
    Router.push(`/admin/questions/${questionId}`);
  }

  getContent() {
    switch (true) {
      case this.state.isLoading:
        return <p>Fetching questions...</p>;

      default:
        return this.getQuestions();
    }
  }

  getQuestions() {
    return this.questions.map(question => (
      <Row key={question.id} onClick={() => this.editQuestion(question.id)}>
        {question.value}
      </Row>
    ));
  }

  render() {
    return <Main>{this.getContent()}</Main>;
  }
}
