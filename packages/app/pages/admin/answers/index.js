import styled from "@emotion/styled";
import debounce from "lodash.debounce";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../../src/actions";
import Answer from "../../../src/components/Answer";
import Pagination from "../../../src/components/Pagination";
import * as C from "../../../src/constants";
import Button from "../../../src/elements/Button";
import Checkbox from "../../../src/elements/Checkbox";
import Input from "../../../src/elements/Input";
import LoadingSpinner from "../../../src/elements/LoadingSpinner";
import Select from "../../../src/elements/Select";
import Title from "../../../src/elements/Title";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import T from "../../../src/texts";

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

const FiltersContainer = styled(Flex)`
  border-bottom: solid 1px var(--color-border);
  padding: 0.5rem 0;

  > * {
    flex-grow: 0.25;
  }
`;

const ActionsContainer = styled(Flex)`
  background-color: var(--color-alice-blue);
  border-bottom: solid 1px var(--color-border);
  padding: 0.5rem 0.5rem 0.5rem 1rem;
`;

export class AdminAnswersIndexPage extends React.Component {
  get queryFilter() {
    return this.$queryFilter !== undefined && this.$queryFilter !== null
      ? this.$queryFilter.value
      : "";
  }

  constructor(props) {
    super(props);

    this.setPageIndex = this.setPageIndex.bind(this);
    this.setQueryFilter = debounce(this.setQueryFilter, 250).bind(this);
  }

  componentDidMount() {
    const { isGeneric } = this.props;

    this.props.dispatch(actions.agreements.load());
    this.props.dispatch(actions.questions.load());
    this.props.dispatch(
      actions.answers.setFilters({
        isGeneric,
      }),
    );
  }

  getCheckableAnswerIds() {
    const { answers } = this.props;

    return answers.list.map(({ id }) => id).filter(id => !answers.checked.includes(id));
  }

  setAgreeementsFilter(selected) {
    const agreements = selected !== null ? selected : [];
    this.props.dispatch(actions.answers.setFilter("agreements", agreements));
  }

  setPageIndex(pageIndex) {
    const { answers, dispatch } = this.props;
    if (answers.isLoading) return;

    dispatch(actions.answers.load(pageIndex));
  }

  setQuestionsFilter(selected) {
    const questions = selected !== null ? selected : [];
    this.props.dispatch(actions.answers.setFilter("questions", questions));
  }

  setQueryFilter() {
    this.props.dispatch(actions.answers.setFilter("query", this.queryFilter));
  }

  setStatesFilter(selected) {
    const states = selected !== null ? selected : [];
    this.props.dispatch(actions.answers.setFilter("states", states));
  }

  check(id) {
    this.props.dispatch(actions.answers.toggleCheck([id]));
  }

  checkAll() {
    const { dispatch } = this.props;
    const ids = this.getCheckableAnswerIds();

    dispatch(actions.answers.toggleCheck(ids));
  }

  uncheckAll() {
    const { dispatch, answers } = this.props;

    dispatch(actions.answers.toggleCheck(answers.checked));
  }

  setCheckedAnswersState() {
    const { checked } = this.props.answers;
    const { value } = this.$newState.state.value;

    this.props.dispatch(
      actions.answers.updateState(checked, value, () =>
        this.props.dispatch(actions.answers.load()),
      ),
    );
  }

  printAnswers() {
    const { isGeneric } = this.props;
    const path = isGeneric ? "generic-answers" : "answers";

    window.open(`/admin/${path}/print`, "_blank");
  }

  editAnswer(id) {
    const path = this.props.isGeneric ? "generic-answers" : "answers";

    if (process.env.NODE_ENV !== "development") {
      window.open(`/admin/${path}/${id}`, "_blank");

      return;
    }

    Router.push(`/admin/${path}/${id}`);
  }

  renderAnswersList() {
    const { checked, list, isLoading } = this.props.answers;

    if (list.length === 0) {
      return (
        <List alignItems="center" justifyContent="center">
          {isLoading ? <LoadingSpinner /> : T.ADMIN_ANSWERS_INFO_NO_DATA}
        </List>
      );
    }

    return (
      <List flexDirection="column">
        {list.map(answer => (
          <Answer
            data={answer}
            isChecked={checked.includes(answer.id)}
            key={answer.id}
            onCheck={this.check.bind(this)}
            onClick={this.editAnswer.bind(this)}
          />
        ))}
      </List>
    );
  }

  render() {
    const { agreements, answers, isGeneric, questions } = this.props;

    const isLoading = isGeneric
      ? answers.isLoading
      : agreements.isLoading || answers.isLoading || questions.isLoading;
    const stateFilterAgreements = agreements.list.map(({ id, idcc, name }) => ({
      label: `[${idcc}] ${name}`,
      value: id,
    }));
    const stateFilterQuestions = questions.list.map(({ id, index, value }) => ({
      label: `${index}) ${value}`,
      value: id,
    }));

    return (
      <AdminMainLayout hasBareContent>
        <Container flexDirection="column">
          <Flex alignItems="center" justifyContent="space-between">
            <Title>{`Réponses${isGeneric ? " génériques" : ""}`}</Title>

            <Button disabled={isLoading} onClick={this.printAnswers.bind(this)}>
              Imprimer
            </Button>
          </Flex>

          {/* Filters */}
          {!isGeneric && (
            <FiltersContainer alignItems="flex-start">
              <Input
                defaultValue={answers.filters.query}
                icon="search"
                onInput={this.setQueryFilter}
                ref={node => (this.$queryFilter = node)}
              />
              <Select
                instanceId="statesFilter"
                isMulti
                onChange={this.setStatesFilter.bind(this)}
                options={C.ANSWER_STATE_OPTIONS}
                value={answers.filters.states}
                withMarginLeft
              />
              <Select
                instanceId="agreementsFilter"
                isLoading={agreements.isLoading}
                isMulti
                onChange={this.setAgreeementsFilter.bind(this)}
                options={stateFilterAgreements}
                value={answers.filters.agreements}
                withMarginLeft
              />
              <Select
                instanceId="questionsFilter"
                isLoading={questions.isLoading}
                isMulti
                onChange={this.setQuestionsFilter.bind(this)}
                options={stateFilterQuestions}
                value={answers.filters.questions}
                withMarginLeft
              />
            </FiltersContainer>
          )}

          {/* Actions */}
          <ActionsContainer alignItems="center" justifyContent="space-between">
            <Checkbox
              isChecked={answers.checked.length > 0}
              isDisabled={isLoading || answers.list.length === 0}
              onClick={
                answers.checked.length > 0 ? this.uncheckAll.bind(this) : this.checkAll.bind(this)
              }
            />
            <Flex>
              <Select
                instanceId="stateAction"
                isDisabled={isLoading || answers.checked.length === 0}
                options={C.ANSWER_STATE_OPTIONS}
                ref={node => (this.$newState = node)}
              />
              <Button
                isDisabled={isLoading || answers.checked.length === 0}
                onClick={this.setCheckedAnswersState.bind(this)}
                withMarginLeft
              >
                {`Appliquer (${answers.checked.length})`}
              </Button>
            </Flex>
          </ActionsContainer>

          {this.renderAnswersList()}

          <Pagination
            onChange={this.setPageIndex}
            pagesIndex={answers.pagesIndex}
            pagesLength={answers.pagesLength}
          />
        </Container>
      </AdminMainLayout>
    );
  }
}

export default connect(({ agreements, answers, questions }) => ({
  agreements,
  answers,
  isGeneric: false,
  questions,
}))(AdminAnswersIndexPage);
