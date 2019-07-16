import debounce from "lodash.debounce";
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
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

import { ANSWER_STATE, ANSWER_STATE_LABEL } from "../../../src/constants";
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

const FilterInput = styled(Input)`
  margin: 0.5rem 0;
  flex-grow: 0.5;
`;
const Head = styled(Flex)`
  margin-bottom: 0.75rem;
`;
const Select = styled(_Select)`
  max-width: 15rem;
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

  get stateFilter() {
    return this.$stateFilter !== undefined && this.$stateFilter !== null
      ? this.$stateFilter.value
      : "";
  }

  constructor(props) {
    super(props);

    this.state = {
      checkedAnswers: []
    };

    this.loadAnswers = debounce(this._loadAnswers.bind(this), 500);
  }

  async componentDidMount() {
    this.axios = customAxios();

    this.loadAnswers();
  }

  _loadAnswers(state = this.props.state, pageIndex = 0) {
    this.props.dispatch(
      actions.answers.load([state], pageIndex, this.queryFilter)
    );
  }

  async setCheckedAnswersStateTo(state) {
    this.setState({ isLoading: true });

    const answersIds = this.state.checkedAnswers.join(",");

    switch (state) {
      case ANSWER_STATE.TO_DO:
        try {
          const answersUri = `/answers?id=in.(${answersIds})`;
          const answersData = {
            generic_reference: null,
            state: ANSWER_STATE.TO_DO,
            user_id: null,
            value: ""
          };
          const answersTagsUri = `/answers_tags?answer_id=in.(${answersIds})`;
          // eslint-disable-next-line prettier/prettier
          const answersReferencesUri =
            `/answers_references?answer_id=in.(${answersIds})`;

          await this.axios.delete(answersReferencesUri);
          await this.axios.delete(answersTagsUri);
          await this.axios.patch(answersUri, answersData);
        } catch (err) {
          console.warn(err);
        }
        break;

      case ANSWER_STATE.DRAFT:
        try {
          const answersUri = `/answers?id=in.(${answersIds})`;
          const answersData = {
            state: ANSWER_STATE.DRAFT
          };

          await this.axios.patch(answersUri, answersData);
        } catch (err) {
          console.warn(err);
        }
        break;
    }

    await this.loadAnswers(this.props.state, 0);
  }

  async updateStateFilter() {
    this.loadAnswers(this.stateFilter);
  }

  checkAnswer(id) {
    if (this.state.checkedAnswers.includes(id)) {
      this.setState({
        checkedAnswers: this.state.checkedAnswers.filter(_id => _id !== id)
      });

      return;
    }

    this.setState({
      checkedAnswers: [...this.state.checkedAnswers, id]
    });
  }

  editAnswer(id) {
    window.open(`/admin/answers/${id}`, "_blank");
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
        isChecked={this.state.checkedAnswers.includes(answer.id)}
        key={answer.id}
        onCheck={this.checkAnswer.bind(this)}
        onClick={this.editAnswer.bind(this)}
      />
    ));
  }

  render() {
    const { isLoading, pageIndex, pageLength, state } = this.props;

    return (
      <AdminMain hasBareContent>
        <Container flexDirection="column">
          <Head alignItems="baseline" justifyContent="space-between">
            <Title>Réponses</Title>
            <Select
              defaultValue={state}
              disabled={isLoading}
              key={`stateFilter-${state}`}
              onChange={() => this.updateStateFilter()}
              ref={node => (this.$stateFilter = node)}
            >
              {Object.keys(ANSWER_STATE_LABEL).map(state => (
                <option key={state} value={state}>
                  {ANSWER_STATE_LABEL[state]}
                </option>
              ))}
            </Select>
          </Head>
          <Flex alignItems="center" justifyContent="space-between">
            <FilterInput
              icon="search"
              key={`queryFilter-${state}`}
              onChange={() => this.loadAnswers()}
              ref={node => (this.$queryFilter = node)}
            />
            <Flex>
              <Button
                disabled={isLoading || this.state.checkedAnswers.length === 0}
                hasGroup
                onClick={() =>
                  this.setCheckedAnswersStateTo(ANSWER_STATE.TO_DO)
                }
              >
                Ré-initialiser
              </Button>
              <Button
                disabled={isLoading || this.state.checkedAnswers.length === 0}
                onClick={() =>
                  this.setCheckedAnswersStateTo(ANSWER_STATE.DRAFT)
                }
              >
                Renvoyer en brouillon
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
  ({ answers: { data, error, isLoading, pageIndex, pageLength, state } }) => ({
    data,
    error,
    isLoading,
    pageIndex,
    pageLength,
    state
  })
)(AdminAnswersIndexPage);
