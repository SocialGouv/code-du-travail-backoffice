import React from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import * as actions from "../../../src/actions";
import ContentTitle from "../../../src/elements/ContentTitle";
import Idcc from "../../../src/elements/Idcc";
import Hr from "../../../src/elements/Hr";
import Subtitle from "../../../src/elements/Subtitle";
import getUriParams from "../../../src/libs/getUriParams";
import markdown from "../../../src/libs/markdown";

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
const Header = styled(Flex)`
  margin-bottom: 0.875rem;
`;

const Pre = styled.pre`
  border: solid 1px var(--color-silver-sand);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  white-space: normal;
`;
const List = styled.ul`
  font-size: 0.875rem;
  list-style-type: square;
  padding-inline-start: 0;
  padding-left: 1.5rem;
`;

export class AdminAnswersPrintPage extends React.Component {
  constructor(props) {
    super(props);

    this.isGeneric = Boolean(props.isGeneric);
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    const { isLoading } = this.props.answers;

    if (!isLoading) window.print();
  }

  load() {
    const uriParams = getUriParams();
    const meta = {
      isGeneric: this.isGeneric,
      query: uriParams.get("query"),
      states: [uriParams.get("state")],
      withReferences: true
    };

    this.props.dispatch(actions.answers.load(meta));
  }

  renderValue(value) {
    return { __html: markdown.toHtml(value) };
  }

  renderAnswers() {
    const { data } = this.props.answers;

    return data.map(({ agreement_idcc, id, question_index, question_value, references, value }) => (
      <div key={id}>
        <Header alignItems="baseline">
          <Idcc code={agreement_idcc} />
          <Subtitle isFirst>{`${question_index}) ${question_value}`}</Subtitle>
        </Header>
        <ContentTitle isFirst>Réponse corrigée:</ContentTitle>
        <Pre dangerouslySetInnerHTML={this.renderValue(value)} />
        {references.length !== 0 && (
          <div>
            <ContentTitle isFirst>Références:</ContentTitle>
            <List>
              {references.map(({ id, value }) => (
                <li key={id}>{value}</li>
              ))}
            </List>
          </div>
        )}
        <Hr />
      </div>
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
  answers
}))(AdminAnswersPrintPage);
