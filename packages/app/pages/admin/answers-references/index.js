import styled from "@emotion/styled";
import debounce from "lodash.debounce";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../../src/actions";
import LegalReferenceTag from "../../../src/components/LegalReferences/Tag";
import Pagination from "../../../src/components/Pagination";
import * as C from "../../../src/constants";
import Button from "../../../src/elements/Button";
import Idcc from "../../../src/elements/Idcc";
import Input from "../../../src/elements/Input";
import LoadingSpinner from "../../../src/elements/LoadingSpinner";
import Select from "../../../src/elements/Select";
import Title from "../../../src/elements/Title";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customNumeral from "../../../src/libs/customNumeral";
import T from "../../../src/texts";

const Container = styled(Flex)`
  flex-grow: 1;
  margin: 0 1rem 1rem;
`;

const FiltersContainer = styled(Flex)`
  border-bottom: solid 1px var(--color-border);
  padding: 0.5rem 0;

  > * {
    flex-grow: 0.25;
  }
`;
const InfoContainer = styled(Flex)`
  background-color: var(--color-alice-blue);
  border-bottom: solid 1px var(--color-border);
  padding: 0.5rem 1rem;
`;

const List = styled(Flex)`
  flex-grow: 1;
  padding-right: 0.5rem;
  min-height: 0;
  overflow-y: auto;
`;
const ListRow = styled(Flex)`
  background-color: white;
  border: solid 1px var(--color-border);
  border-radius: 0.4rem;
  margin-top: 0.5rem;
  padding: 0 0.75rem 0.5rem;
`;
export const OpenButton = styled(Button)`
  font-size: 0.875rem;

  padding: 0.325rem 0.375rem 0.375rem 0.5rem;
`;

export class AdminAnswersReferencesIndexPage extends React.Component {
  get queryFilter() {
    return this.$queryFilter !== undefined && this.$queryFilter !== null
      ? this.$queryFilter.value
      : "";
  }

  constructor(props) {
    super(props);

    this.setCategoryFilter = this.setCategoryFilter.bind(this);
    this.setPageIndex = this.setPageIndex.bind(this);
    this.setQueryFilter = debounce(this.setQueryFilter, 250).bind(this);
    this.setStatesFilter = this.setStatesFilter.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(actions.answersReferences.setFilter("pageLength", 10));
  }

  open(answerId) {
    window.open(`/admin/answers/${answerId}`, "_blank");
  }

  setPageIndex(pageIndex) {
    const { answersReferences, dispatch } = this.props;
    if (answersReferences.isLoading) return;

    dispatch(actions.answersReferences.load(pageIndex));
  }

  setQueryFilter() {
    this.props.dispatch(actions.answersReferences.setFilter("query", this.queryFilter));
  }

  setCategoryFilter(selectedOption) {
    this.props.dispatch(actions.answersReferences.setFilter("category", selectedOption.value));
  }

  setStatesFilter(_selectedOptions) {
    const selectedOptions = _selectedOptions ?? [];
    const nextStates = selectedOptions.map(({ value }) => value);

    this.props.dispatch(actions.answersReferences.setFilter("states", nextStates));
  }

  getSelectedCategoryOption() {
    const {
      answersReferences: {
        filters: { category },
      },
    } = this.props;

    return C.ANSWER_REFERENCE_CATEGORY_OPTIONS.find(({ value }) => category.includes(value));
  }

  getSelectedStatesOptions() {
    const {
      answersReferences: {
        filters: { states },
      },
    } = this.props;

    return C.ANSWER_REFERENCE_STATE_OPTIONS.filter(({ value }) => states.includes(value));
  }

  renderAnswerReferencesList() {
    const { answers, list, isLoading } = this.props.answersReferences;

    if (list.length === 0) {
      return (
        <List alignItems="center" justifyContent="center">
          {isLoading ? <LoadingSpinner /> : T.ADMIN_ANSWERS_INFO_NO_DATA}
        </List>
      );
    }

    return (
      <List flexDirection="column">
        {list.map(answerReference => {
          const answer = answers.find(({ id }) => id === answerReference.answer_id);

          return (
            <ListRow alignItems="baseline" justifyContent="space-between" key={answerReference.id}>
              {answer.agreement !== undefined ? (
                <Idcc code={answer.agreement.idcc} name={answer.agreement.name} />
              ) : (
                <Idcc />
              )}
              <Idcc code={String(answer.question.index)} name={answer.question.value} />
              <LegalReferenceTag {...answerReference} />
              <OpenButton
                color="secondary"
                icon="external-link-alt"
                onClick={() => this.open(answerReference.answer_id)}
              />
            </ListRow>
          );
        })}
      </List>
    );
  }

  render() {
    const { answersReferences } = this.props;

    return (
      <AdminMainLayout hasBareContent>
        <Container flexDirection="column">
          <Flex alignItems="center" justifyContent="space-between">
            <Title>Références légales</Title>
          </Flex>

          <FiltersContainer alignItems="flex-start" justifyContent="space-between">
            <Input
              defaultValue={answersReferences.filters.query}
              icon="search"
              onInput={this.setQueryFilter}
              ref={node => (this.$queryFilter = node)}
            />
            <Select
              instanceId="categoryFilter"
              onChange={this.setCategoryFilter}
              options={C.ANSWER_REFERENCE_CATEGORY_OPTIONS}
              pageSize={10}
              value={this.getSelectedCategoryOption()}
              withMarginLeft
            />
            <Select
              instanceId="statesFilter"
              isMulti
              onChange={this.setStatesFilter}
              options={C.ANSWER_REFERENCE_STATE_OPTIONS}
              pageSize={10}
              value={this.getSelectedStatesOptions()}
              withMarginLeft
            />
          </FiltersContainer>

          <InfoContainer alignItems="center">
            {`${customNumeral(answersReferences.length).format("0,0")} résultats.`}
          </InfoContainer>

          {this.renderAnswerReferencesList()}

          <Pagination
            onChange={this.setPageIndex}
            pagesIndex={answersReferences.pagesIndex}
            pagesLength={answersReferences.pagesLength}
          />
        </Container>
      </AdminMainLayout>
    );
  }
}

export default connect(({ answersReferences }) => ({
  answersReferences,
}))(AdminAnswersReferencesIndexPage);
