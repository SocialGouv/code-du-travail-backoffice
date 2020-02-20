import styled from "@emotion/styled";
import React from "react";
import { connect } from "react-redux";

import * as actions from "../../../src/actions";
import markdown from "../../../src/libs/markdown";

const Container = styled.div`
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;

  @media print {
    height: auto;
    padding: 0;
  }
`;

const Answer = styled.div`
  @media print {
    page-break-inside: avoid;
  }
`;
const Content = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  white-space: normal;
`;
const List = styled.ul`
  font-size: 0.875rem;
  list-style-type: square;
  padding-inline-start: 0;
  padding-left: 1.5rem;
`;

export class AdminAnswersPrintPage extends React.Component {
  componentDidMount() {
    const { isGeneric } = this.props;

    this.props.dispatch(
      actions.answers.setFilters({
        isGeneric,
        page: 0,
        pageLength: 100,
      }),
    );
  }

  componentDidUpdate() {
    const { isLoading } = this.props.answers;

    if (!isLoading) window.print();
  }

  renderValue(value) {
    return { __html: markdown.toHtml(value) };
  }

  renderAnswers() {
    const { data } = this.props.answers;

    return data.map(({ agreement_idcc, id, question_index, question_value, references, value }) => (
      <Answer key={id}>
        <h2>{`[IDCC: ${agreement_idcc}] ${question_index}) ${question_value}`}</h2>
        <h3>Réponse corrigée:</h3>
        <Content dangerouslySetInnerHTML={this.renderValue(value)} />
        {references.length !== 0 && (
          <div>
            <h3>Références:</h3>
            <List>
              {references.map(({ id, value }) => (
                <li key={id}>{value}</li>
              ))}
            </List>
          </div>
        )}
        <hr />
      </Answer>
    ));
  }

  render() {
    const { isLoading } = this.props.answers;

    if (isLoading) {
      return <Container>Chargement…</Container>;
    }

    return <Container flexDirection="column">{this.renderAnswers()}</Container>;
  }
}

export default connect(({ answers }) => ({
  answers,
  isGeneric: false,
}))(AdminAnswersPrintPage);
