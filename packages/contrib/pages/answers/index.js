import debounce from "lodash.debounce";
import Router from "next/router";
import * as R from "ramda";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";
import styled from "styled-components";

import * as actions from "../../src/actions";
import Answer from "../../src/blocks/Answer";
import Pagination from "../../src/components/Pagination";
import Input from "../../src/elements/Input";
import Subtitle from "../../src/elements/Subtitle";
import Main from "../../src/layouts/Main";
import postgrest from "../../src/libs/postgrest";

import { ANSWER_STATE } from "../../src/constants";
import T from "../../src/texts";

const Content = styled(Flex)`
  flex-grow: 1;
  padding: 0 1rem 1rem;
`;
const List = styled(Flex)`
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
`;

const Text = styled.p`
  margin-bottom: 0.5rem;
`;
const InfoText = styled(Text)`
  color: var(--color-dark-slate-gray);
`;
const ErrorText = styled(Text)`
  color: var(--color-text-red);
  font-weight: 600;
`;
const HelpText = styled(Text)`
  font-size: 0.875rem;
`;

const FilterInputContainer = styled.div`
  margin-right: 13rem;
`;
const FilterInput = styled(Input)`
  margin: 0.5rem 0;
`;

class AnswersIndexPage extends React.Component {
  get query() {
    return this.$query !== undefined && this.$query !== null
      ? this.$query.value
      : "";
  }

  constructor(props) {
    super(props);

    this.state = {
      me: null
    };

    this.loadAnswers = debounce(this._loadAnswers.bind(this), 500);
  }

  static getInitialProps({ query: { page: maybePage, state: maybeState } }) {
    const page =
      Math.abs(Math.floor(!isNaN(maybePage) ? Number(maybePage) - 1 : 0)) + 1;
    const state =
      maybeState !== undefined && R.values(ANSWER_STATE).includes(maybeState)
        ? maybeState
        : ANSWER_STATE.TO_DO;

    return { page, state };
  }

  componentDidMount() {
    this.loadAnswers(this.props.page - 1);
  }

  componentDidUpdate() {
    const { isLoading, pageIndex, state } = this.props;
    const page = pageIndex + 1;

    if (!isLoading) {
      if (window.location.pathname === "/") {
        Router.replace(
          {
            pathname: "/answers",
            query: { page, state }
          },
          `/answers/${state}/${page}`,
          { shallow: true }
        );
      } else {
        Router.push(
          {
            pathname: "/answers",
            query: { page, state }
          },
          `/answers/${state}/${page}`,
          { shallow: true }
        );
      }
    }
  }

  _loadAnswers(pageIndex = 0) {
    const { state } = this.props;

    const query = this.query;
    const request = postgrest().eq("state", state);

    const finalRequest =
      query.length !== 0
        ? request.or
            .ilike("agreement", `%${query}%`)
            .eq("idcc", isNaN(query) ? 0 : query)
            .eq("index", isNaN(query) ? 0 : query)
            .ilike("question", `%${query}%`)
            .ilike("value", `%${query}%`)
        : request;

    this.props.dispatch(actions.answers.load(finalRequest, pageIndex));
  }

  cancelAnswer(id) {
    const action = () =>
      actions.answers.cancel([id], this.loadAnswers.bind(this));

    this.props.dispatch(
      actions.modal.open(T.ANSWERS_INDEX_MODAL_CANCEL, action)
    );
  }

  setAnswerGenericReference(id, genericReference) {
    this.props.dispatch(
      actions.answers.setGenericRefence(
        [id],
        genericReference,
        this.loadAnswers.bind(this)
      )
    );
  }

  editAnswer(id) {
    Router.push(`/answers/edit/${id}`);
  }

  getAnswersList() {
    const { data, error, state } = this.props;

    if (error !== null) {
      return <ErrorText>{error}</ErrorText>;
    }

    if (data.length === 0) {
      if (this.query.length !== 0) {
        return <InfoText>{T.ANSWERS_INDEX_INFO_NO_SEARCH_RESULT}</InfoText>;
      }

      return <InfoText>{T.ANSWERS_INDEX_INFO_NO_DATA(state)}</InfoText>;
    }

    return data.map(answer => [
      <Answer
        data={answer}
        key={answer.id}
        onCancel={this.cancelAnswer.bind(this)}
        onClick={this.editAnswer.bind(this)}
        onFallback={this.setAnswerGenericReference.bind(this)}
      />
    ]);
  }

  render() {
    const { data, isLoading, pageIndex, pageLength, state } = this.props;

    return (
      <Main isHorizontal>
        <Content flexDirection="column">
          <Subtitle>{T.ANSWERS_INDEX_TITLE(state)}</Subtitle>
          <FilterInputContainer>
            <FilterInput
              icon="search"
              onChange={() => this.loadAnswers()}
              placeholder={T.ANSWERS_INDEX_SEARCH_PLACEHOLDER}
              ref={node => (this.$query = node)}
            />
          </FilterInputContainer>
          {isLoading && (
            <List>
              <HelpText>Chargement…</HelpText>
            </List>
          )}
          {!isLoading && (
            <List flexDirection="column">
              {state === ANSWER_STATE.TO_DO && data.length !== 0 && (
                <HelpText>{T.ANSWERS_INDEX_HELP_TO_DO}</HelpText>
              )}
              {this.getAnswersList()}
            </List>
          )}
          {!isLoading && pageLength !== 0 && (
            <Pagination
              initialPage={pageIndex}
              onPageChange={({ selected }) => this.loadAnswers(selected)}
              pageCount={pageLength}
            />
          )}
        </Content>
      </Main>
    );
  }
}

export default connect(
  ({ answers: { data, error, isLoading, pageIndex, pageLength } }) => ({
    data,
    error,
    isLoading,
    pageIndex,
    pageLength
  })
)(AnswersIndexPage);
