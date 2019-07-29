import debounce from "lodash.debounce";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";
import styled from "styled-components";

import * as actions from "../../../src/actions";
import AdminAnswer from "../../../src/blocks/AdminAnswer";
import Pagination from "../../../src/components/Pagination";
import Button from "../../../src/elements/Button";
import Input from "../../../src/elements/Input";
import _Select from "../../../src/elements/Select";
import Title from "../../../src/elements/Title";
import capitalize from "../../../src/helpers/capitalize";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

import { ANSWER_STATE_LABEL } from "../../../src/constants";
import T from "../../../src/texts";

const { NODE_ENV } = process.env;
const STATES = Object.keys(ANSWER_STATE_LABEL);

const Container = styled(Flex)`
  flex-grow: 1;
  margin: 0 1rem 1rem;
`;
const List = styled(Flex)`
  flex-grow: 1;
  padding-right: 1rem;
  min-height: 0;
  overflow-y: auto;
`;

const FilterInput = styled(Input)`
  margin: 0.5rem 0;
  flex-grow: 0.5;
`;
const Top = styled(Flex)`
  margin-bottom: 0.75rem;
`;
const FilterSelect = styled(_Select)`
  max-width: 15rem;
`;
const StateSelect = styled(_Select)`
  border: solid 1px var(--color-lapis-lazuli);
  color: var(--color-lapis-lazuli);
  margin-right: 1rem;
  width: 15rem;
`;

const Text = styled.p`
  margin-bottom: 0.5rem;
`;
const HelpText = styled(Text)`
  font-size: 0.875rem;
`;

class AdminAnswersIndexPage extends React.Component {
  get queryFilter() {
    return this.$queryFilter !== undefined && this.$queryFilter !== null
      ? this.$queryFilter.value
      : "";
  }

  constructor(props) {
    super(props);

    this.loadAnswers = debounce(this._loadAnswers.bind(this), 500);
  }

  componentDidMount() {
    this.axios = customAxios();

    this.loadAnswers();
  }

  _loadAnswers(state = this.props.state, pageIndex = 0) {
    this.props.dispatch(
      actions.answers.load([state], pageIndex, this.queryFilter)
    );
  }

  updateStateFilter() {
    this.loadAnswers(this.$stateFilter.value);
  }

  checkAnswer(id) {
    this.props.dispatch(actions.answers.toggleCheck(this.props.checked, [id]));
  }

  setCheckedAnswersState() {
    const newState = this.$newStateSelect.value;

    this.props.dispatch(
      actions.answers.setState(this.props.checked, newState, () =>
        this.loadAnswers(this.props.state, 0)
      )
    );
  }

  editAnswer(id) {
    if (NODE_ENV !== "development") {
      window.open(`/admin/answers/${id}`, "_blank");

      return;
    }

    Router.push(`/admin/answers/${id}`);
  }

  getAnswersList() {
    const { data, state } = this.props;

    if (data.length === 0) {
      if (this.queryFilter.length !== 0) {
        return <p>{T.ADMIN_ANSWERS_INFO_NO_SEARCH_RESULT}</p>;
      }

      return <p>{T.ADMIN_ANSWERS_INFO_NO_DATA(state)}</p>;
    }

    return data.map(answer => (
      <AdminAnswer
        data={answer}
        isChecked={this.props.checked.includes(answer.id)}
        key={answer.id}
        onCheck={this.checkAnswer.bind(this)}
        onClick={this.editAnswer.bind(this)}
      />
    ));
  }

  render() {
    const { checked, isLoading, pageIndex, pageLength, state } = this.props;

    return (
      <AdminMain hasBareContent>
        <Container flexDirection="column">
          <Top alignItems="baseline" justifyContent="space-between">
            <Title>Réponses</Title>
            <FilterSelect
              defaultValue={state}
              disabled={isLoading}
              key={`stateFilter-${state}`}
              onChange={() => this.updateStateFilter()}
              ref={node => (this.$stateFilter = node)}
            >
              {STATES.map(state => (
                <option key={state} value={state}>
                  {capitalize(ANSWER_STATE_LABEL[state])}
                </option>
              ))}
            </FilterSelect>
          </Top>
          <Flex alignItems="center" justifyContent="space-between">
            <FilterInput
              icon="search"
              key={`queryFilter-${state}`}
              onChange={() => this.loadAnswers()}
              ref={node => (this.$queryFilter = node)}
            />
            <Flex>
              <StateSelect
                defaultValue={state}
                disabled={isLoading || checked.length === 0}
                ref={node => (this.$newStateSelect = node)}
              >
                {STATES.filter(_state => _state !== state).map(state => (
                  <option key={state} value={state}>
                    {capitalize(ANSWER_STATE_LABEL[state])}
                  </option>
                ))}
              </StateSelect>
              <Button
                disabled={isLoading || checked.length === 0}
                onClick={this.setCheckedAnswersState.bind(this)}
              >
                Appliquer
              </Button>
            </Flex>
          </Flex>
          {isLoading && (
            <List>
              <HelpText>Chargement…</HelpText>
            </List>
          )}
          {!isLoading && (
            <List flexDirection="column">{this.getAnswersList()}</List>
          )}
          {!isLoading && pageLength > 0 && (
            <Pagination
              initialPage={pageIndex}
              onPageChange={({ selected }) => this.loadAnswers(state, selected)}
              pageCount={pageLength}
            />
          )}
        </Container>
      </AdminMain>
    );
  }
}

export default connect(
  ({
    answers: { checked, data, error, isLoading, pageIndex, pageLength, state }
  }) => ({
    checked,
    data,
    error,
    isLoading,
    pageIndex,
    pageLength,
    state
  })
)(AdminAnswersIndexPage);
