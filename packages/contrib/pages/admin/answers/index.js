import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import AdminAnswer from "../../../src/blocks/AdminAnswer";
import Pagination from "../../../src/components/Pagination";
import Button from "../../../src/elements/Button";
import Input from "../../../src/elements/Input";
import _Select from "../../../src/elements/Select";
import Title from "../../../src/elements/Title";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";
import stringFrIncludes from "../../../src/libs/stringFrIncludes";

import { ANSWER_STATE, ANSWER_STATE_LABEL } from "../../../src/constants";
import T from "../../../src/texts";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
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

const ANSWERS_PER_PAGE = 5;

export default class AdminAnswersIndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      checkedAnswers: [],
      currentPage: 0,
      filterInputKey: 0,
      isLoading: true,
      paginationKey: 0,
      query: "",
      state: null,
      users: []
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    await this.fetchAnswers(ANSWER_STATE.PENDING_REVIEW);
  }

  async fetchAnswers(state) {
    this.setState({ isLoading: true });

    try {
      // eslint-disable-next-line prettier/prettier
      const select =
        `select=*,agreement(idcc,name),question(index,value),user(name)`;
      const filter = `state=eq.${state}`;
      const order = `order=updated_at.desc`;

      const uri = `/answers?${select}&${filter}&${order}`;
      const { data: answers } = await this.axios.get(uri);

      this.setState({
        answers,
        checkedAnswers: [],
        currentPage: 0,
        // We force a <FilterInput> re-rendering to empty its value:
        filterInputKey: this.state.paginationKey + 1,
        isLoading: false,
        // We force a <Pagination> re-rendering to udpate its new initial page
        // value:
        paginationKey: this.state.paginationKey + 1,
        query: "",
        state
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }

    this.setState({ isLoading: false });
  }

  async setCheckedAnswersStateTo(state) {
    this.setState({ isLoading: true });

    const answersIds = this.state.checkedAnswers.join(",");

    switch (state) {
      case ANSWER_STATE.TODO:
        try {
          const answersUri = `/answers?id=in.(${answersIds})`;
          const answersData = {
            generic_reference: null,
            state: ANSWER_STATE.TODO,
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

    await this.fetchAnswers(this.state.state);
  }

  async updateStateFilter(event) {
    await this.fetchAnswers(event.target.value);
  }

  updateQueryFilter(event) {
    this.setState({
      currentPage: 0,
      // We force a <Pagination> re-rendering to udpate its new initial page
      // value:
      paginationKey: this.state.paginationKey + 1,
      query: event.target.value
    });
  }

  filterAnswers() {
    const queryFilter =
      this.state.query.length !== 0
        ? ({ agreement, question, user }) =>
            stringFrIncludes(this.state.query, agreement.name) ||
            agreement.idcc.includes(this.state.query) ||
            question.index === Number(this.state.query) ||
            stringFrIncludes(this.state.query, question.value) ||
            stringFrIncludes(this.state.query, user.name)
        : () => true;

    return this.state.answers.filter(queryFilter);
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
    Router.push(
      {
        pathname: `${window.location.pathname}/edit`,
        query: { id }
      },
      `${window.location.pathname}/${id}`
    );
  }

  getAnswersList(answers) {
    if (answers.length === 0) {
      if (this.state.query.length !== 0) {
        return <p>Cette recherche ne retourne aucun résultat.</p>;
      }

      return (
        <p>
          {`Il n'y a pour l'instant aucune réponse ${ANSWER_STATE_LABEL[
            this.state.state
          ].toLowerCase()}.`}
        </p>
      );
    }

    return answers.map(answer => (
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
    if (this.state.isLoading) return <AdminMain isLoading />;

    const answers = this.filterAnswers();
    const answersChunk = answers.slice(
      this.state.currentPage * ANSWERS_PER_PAGE,
      (this.state.currentPage + 1) * ANSWERS_PER_PAGE
    );
    const pageCount = Math.ceil(this.state.answers.length / ANSWERS_PER_PAGE);

    return (
      <AdminMain>
        <Container flexDirection="column">
          <Head alignItems="baseline" justifyContent="space-between">
            <Title>Réponses</Title>
            <Select
              defaultValue={this.state.state}
              onChange={this.updateStateFilter.bind(this)}
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
              key={`filterInput-${this.state.filterInputKey}`}
              onChange={this.updateQueryFilter.bind(this)}
              placeholder={T.ADMIN_ANSWERS_SEARCH_PLACEHOLDER}
            />
            <Flex>
              <Button
                disabled={
                  this.state.isLoading || this.state.checkedAnswers.length === 0
                }
                hasGroup
                onClick={() => this.setCheckedAnswersStateTo(ANSWER_STATE.TODO)}
              >
                Ré-initialiser
              </Button>
              <Button
                disabled={
                  this.state.isLoading || this.state.checkedAnswers.length === 0
                }
                onClick={() =>
                  this.setCheckedAnswersStateTo(ANSWER_STATE.DRAFT)
                }
              >
                Renvoyer en brouillon
              </Button>
            </Flex>
          </Flex>
          {this.getAnswersList(answersChunk)}
          {pageCount > 1 && (
            <Pagination
              key={`pagination-${this.state.paginationKey}`}
              initialPage={this.state.currentPage}
              onPageChange={({ selected: currentPage }) =>
                this.setState({ currentPage })
              }
              pageCount={pageCount}
            />
          )}
        </Container>
      </AdminMain>
    );
  }
}
