import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import * as actions from "../../../src/actions";
import ContentTitle from "../../../src/elements/ContentTitle";
import Hr from "../../../src/elements/Hr";
import Subtitle from "../../../src/elements/Subtitle";
import customAxios from "../../../src/libs/customAxios";

import T from "../../../src/texts";

const Container = styled.div`
  height: 100vh;
  overflow-y: auto;

  @media print {
    height: auto;
  }
`;

const Text = styled.p`
  margin-bottom: 0.5rem;
`;
const HelpText = styled(Text)`
  font-size: 0.875rem;
`;

export class AdminAnswersPrintPage extends React.Component {
  componentDidMount() {
    this.axios = customAxios();

    this.loadAnswers();
  }

  loadAnswers() {
    const uriParams = new URLSearchParams(window.location.search);
    const query = uriParams.get("query");
    const state = uriParams.get("state");

    this.props.dispatch(
      actions.answers.load([state], -1, query, this.isGeneric)
    );
  }

  getAnswersList() {
    const uriParams = new URLSearchParams(window.location.search);
    const state = uriParams.get("state");
    const { data } = this.props.answers;

    if (data.length === 0) {
      if (this.queryFilter.length !== 0) {
        return <p>{T.ADMIN_ANSWERS_INFO_NO_SEARCH_RESULT}</p>;
      }

      return <p>{T.ADMIN_ANSWERS_INFO_NO_DATA(state)}</p>;
    }

    return data.map(({ id, question_index, question_value, value }) => (
      <div key={id}>
        <Subtitle isFirst>{`${question_index}) ${question_value}`}</Subtitle>
        <ContentTitle isFirst>Réponse corrigée:</ContentTitle>
        <pre>{value}</pre>
        <Hr />
      </div>
    ));
  }

  render() {
    const { isLoading } = this.props.answers;

    if (isLoading) {
      return (
        <Container>
          <HelpText>Chargement…</HelpText>
        </Container>
      );
    }

    return (
      <Container flexDirection="column">{this.getAnswersList()}</Container>
    );
  }
}

export default connect(({ answers }) => ({
  answers
}))(AdminAnswersPrintPage);
