import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import * as actions from "../../../src/actions";
import ContentTitle from "../../../src/elements/ContentTitle";
import Idcc from "../../../src/elements/Idcc";
import Hr from "../../../src/elements/Hr";
import Subtitle from "../../../src/elements/Subtitle";
import customAxios from "../../../src/libs/customAxios";

import T from "../../../src/texts";
import { Flex } from "rebass";

const Container = styled.div`
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;

  @media print {
    height: auto;
    padding: 0;
  }
`;

const Pre = styled.pre`
  font-size: 1.1rem;
  white-space: normal;
`;

export class AdminAnswersPrintPage extends React.Component {
  constructor(props) {
    super(props);

    this.isGeneric = Boolean(props.isGeneric);
  }

  componentDidMount() {
    this.axios = customAxios();

    this.loadAnswers();
  }

  componentDidUpdate() {
    const { isLoading } = this.props.answers;

    if (!isLoading) window.print();
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

    return data.map(
      ({ agreement_idcc, id, question_index, question_value, value }) => (
        <div key={id}>
          <Flex alignItems="baseline">
            <Idcc code={agreement_idcc} />
            <Subtitle
              isFirst
            >{`${question_index}) ${question_value}`}</Subtitle>
          </Flex>
          <ContentTitle isFirst>Réponse corrigée:</ContentTitle>
          <Pre>{value}</Pre>
          <Hr />
        </div>
      )
    );
  }

  render() {
    const { isLoading } = this.props.answers;

    if (isLoading) {
      return <Container>Chargement…</Container>;
    }

    return (
      <Container flexDirection="column">{this.getAnswersList()}</Container>
    );
  }
}

export default connect(({ answers }) => ({
  answers
}))(AdminAnswersPrintPage);
