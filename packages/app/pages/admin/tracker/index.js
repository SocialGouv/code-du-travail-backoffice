import styled from "@emotion/styled";
import debounce from "lodash.debounce";
import React from "react";
import ReactDiffViewer from "react-diff-viewer";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../../src/actions";
import Tree from "../../../src/components/Tree";
import Button from "../../../src/elements/Button";
import Icon from "../../../src/elements/Icon";
import LoadingSpinner from "../../../src/elements/LoadingSpinner";
import MarkdownEditor from "../../../src/elements/MarkdownEditor";
import Title from "../../../src/elements/Title";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import api from "../../../src/libs/api";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;

const TreeContainer = styled(Flex)`
  max-width: 20rem;
  min-width: 20rem;
`;

const Editor = styled(MarkdownEditor)`
  max-height: 100%;
  min-height: 100%;

  .editor {
    border: 0 !important;
  }
`;

export class AdminTrackerIndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.selectAnswer = this.selectAnswer.bind(this);
    this.updateAnswerValue = debounce(this._updateAnswerValue.bind(this), 500).bind(this);

    this.state = {
      selectedReferenceDiff: null,
    };
  }

  componentDidMount() {
    this.props.dispatch(actions.answers.toggleIsLoading());
    this.props.dispatch(actions.alerts.load());
  }

  selectAnswer({ key }) {
    this.props.dispatch(actions.alerts.selectOne(key));
  }

  async _updateAnswerValue({ source }) {
    try {
      const {
        answers: {
          data: { id },
        },
      } = this.props;
      const value = source.trim();
      const uri = `/answers?id=eq.${id}`;
      const data = { value };

      await api.patch(uri, data);
    } catch (err) {
      console.warn(err);
    }
  }

  openAnswerInNewTab(id) {
    window.open(`/admin/answers/${id}`, "_blank");
  }

  processAnswer() {
    this.props.dispatch(actions.alerts.processOne());
  }

  renderDiff() {
    const {
      alerts: {
        // diff: { etat, texts },
        diff: { texts },
      },
    } = this.props;

    return (
      <ReactDiffViewer newValue={texts[0].current} oldValue={texts[0].previous} splitView={true} />
    );
  }

  renderTree() {
    const { alerts } = this.props;
    const { isLoading, selectedKey, tree } = alerts;

    if (isLoading) {
      return (
        <TreeContainer alignItems="center" flexGrow="1" justifyContent="center">
          <LoadingSpinner />
        </TreeContainer>
      );
    }

    return (
      <TreeContainer flexDirection="column" flexGrow="1">
        <Title>Tableau de veille</Title>
        <Tree data={tree} onChange={this.selectAnswer} selectedKey={selectedKey} />
      </TreeContainer>
    );
  }

  renderEditor() {
    const {
      alerts: { isLoading: alertsIsLoading },
      answers: { data: answersData, isLoading: answersIsLoading },
    } = this.props;

    if (alertsIsLoading || answersIsLoading) {
      return (
        <Flex alignItems="center" flexGrow="1" justifyContent="center">
          <LoadingSpinner />
        </Flex>
      );
    }

    if (answersData === null) {
      return (
        <p style={{ marginLeft: "1rem", marginTop: "4rem" }}>
          <Icon icon="arrow-left" style={{ marginRight: "0.5rem" }} />
          Sélectionnez une réponse parmi les alertes pour la traiter.
        </p>
      );
    }

    const { id, value } = answersData;

    return (
      <Flex flexDirection="column" flexGrow="1">
        <Flex style={{ maxHeight: "calc(50% - 1.5rem)", minHeight: "calc(50% - 1.5rem)" }}>
          {this.renderDiff()}
        </Flex>
        <Flex style={{ maxHeight: "calc(50% - 1.5rem)", minHeight: "calc(50% - 1.5rem)" }}>
          <Editor defaultValue={value} isSingleView onChange={this.updateAnswerValue} />
        </Flex>
        <Flex
          justifyContent="flex-end"
          style={{ marginTop: "1rem", maxHeight: "2rem", minHeight: "2rem" }}
        >
          <Button
            color="secondary"
            icon="external-link-alt"
            onClick={() => this.openAnswerInNewTab(id)}
            withMarginRight
          >
            OUVRIR
          </Button>
          <Button onClick={() => this.processAnswer(id)}>TRAITER</Button>
        </Flex>
      </Flex>
    );
  }

  render() {
    return (
      <AdminMainLayout noScroll>
        <Container flexGrow="1">
          {this.renderTree()}
          {this.renderEditor()}
        </Container>
      </AdminMainLayout>
    );
  }
}

export default connect(({ alerts, answers, legalReferences }) => ({
  alerts,
  answers,
  legalReferences,
}))(AdminTrackerIndexPage);
