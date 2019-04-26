import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Answer from "../src/blocks/Answer";
import Pagination from "../src/components/Pagination";
import Input from "../src/elements/Input";
import Subtitle from "../src/elements/Subtitle";
import Main from "../src/layouts/Main";
import customAxios from "../src/libs/customAxios";
import makeApiFilter from "../src/libs/makeApiFilter";
import stringFrIncludes from "../src/libs/stringFrIncludes";

const Content = styled(Flex)`
  overflow-y: auto;
  padding: 0 1rem 0.5rem;
`;
const InfoText = styled.p`
  color: var(--color-dark-slate-gray);
  margin-bottom: 0.5rem;
`;
const HelpText = styled.p`
  color: var(--color-shadow);
  font-size: 0.875rem;
  font-style: italic;
  margin-bottom: 0.5rem;
`;
const FilterInput = styled(Input)`
  margin-top: 1rem;
  max-width: 20rem;
`;

const ANSWERS_PER_PAGE = 10;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      currentPage: 0,
      isLoading: true,
      isSaving: false,
      query: "",
      paginationKey: 0
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    await this.loadAnswers();
  }

  async loadAnswers() {
    this.setState({ isLoading: true });

    try {
      const { data: answers } = await this.axios.get(`/contributor_answers`);
      this.setState({
        answers,
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  /**
   * Cancel an answer draft by resettinng all its related data.
   */
  async cancelAnswer(id) {
    this.setState({ isLoading: true });

    const answersUri = `/answers?id=eq.${id}`;
    const answersData = {
      generic_reference: null,
      state: "todo",
      user_id: null,
      value: ""
    };
    const answersTagsUri = makeApiFilter("/answers_tags", {
      answer_id: id
    });
    const answersReferencesUri = makeApiFilter("/answers_references", {
      answer_id: id
    });

    await this.axios.delete(answersReferencesUri).catch(console.warn);
    await this.axios.delete(answersTagsUri).catch(console.warn);
    await this.axios.patch(answersUri, answersData).catch(console.warn);

    await this.loadAnswers();
  }

  /**
   * Update an answer to make it generic.
   *
   * @description
   * A generic answer can fallback to either Labor Code or its parent national
   * agreement text.
   */
  async fallAnswerBack(id, generic_reference) {
    this.setState({ isLoading: true });

    const uri = `/answers?id=eq.${id}`;
    const data = { generic_reference, state: "draft", value: "" };

    await this.axios.patch(uri, data).catch(console.warn);

    await this.loadAnswers();
  }

  editAnswer(id) {
    Router.push(
      {
        pathname: "/answer",
        query: { id }
      },
      `/answer/${id}`
    );
  }

  fetchAnswers(isDraft = false) {
    const stateFilter = isDraft
      ? ({ state }) => state === "draft"
      : ({ state }) => state === "todo";

    const queryFilter =
      this.state.query.length !== 0
        ? ({ agreement, idcc, question }) =>
            stringFrIncludes(this.state.query, agreement) ||
            idcc.includes(this.state.query) ||
            stringFrIncludes(this.state.query, question)
        : () => true;

    return this.state.answers.filter(stateFilter).filter(queryFilter);
  }

  filterAnswers(event) {
    this.setState({
      currentPage: 0,
      query: event.target.value,
      // We force a <Pagination> re-rendering to udpate its new initial page
      // value:
      paginationKey: this.state.paginationKey + 1
    });
  }

  getAnswersList(answers, isDraft = false) {
    if (answers.length === 0) {
      if (isDraft) {
        return (
          <InfoText>
            {`Vous n'avez pas encore commencé à rédiger de réponses.`}
          </InfoText>
        );
      }

      if (this.state.query.length !== 0) {
        return (
          <InfoText>{`Cette recherche ne retourne aucun résultat.`}</InfoText>
        );
      }

      return (
        <InfoText>
          {`Il n'y a pour l'instant (plus) auncune réponse à rédiger.`}
        </InfoText>
      );
    }

    return answers.map(answer => [
      <Answer
        data={answer}
        isDraft={isDraft}
        key={answer.id}
        onCancel={this.cancelAnswer.bind(this)}
        onClick={this.editAnswer.bind(this)}
        onFallback={this.fallAnswerBack.bind(this)}
      />
    ]);
  }

  render() {
    if (this.state.isLoading) return <Main isLoading />;

    const draftAnswers = this.fetchAnswers(true);
    const newAnswers = this.fetchAnswers();
    const newAnswersChunk = newAnswers.slice(
      this.state.currentPage * ANSWERS_PER_PAGE,
      (this.state.currentPage + 1) * ANSWERS_PER_PAGE
    );
    const pageCount = Math.ceil(newAnswers.length / ANSWERS_PER_PAGE);

    return (
      <Main>
        <Content flexDirection="column" width={1}>
          <Subtitle>Mes réponses en cours de rédaction</Subtitle>
          {draftAnswers.length !== 0 && (
            <HelpText>Sélectionnez une réponse pour la modifier:</HelpText>
          )}
          {this.getAnswersList(draftAnswers, true)}

          <Flex alignItems="center" justifyContent="space-between">
            <Subtitle>Réponses à rédiger</Subtitle>
            <FilterInput
              onChange={this.filterAnswers.bind(this)}
              placeholder="Rechercher par intitulé ou CCN..."
            />
          </Flex>
          {newAnswers.length !== 0 && (
            <HelpText>
              Sélectionnez une question pour commencer à rédiger une réponse:
            </HelpText>
          )}
          {this.getAnswersList(newAnswersChunk)}
          {pageCount !== 0 && (
            <Pagination
              key={this.state.paginationKey}
              initialPage={this.state.currentPage}
              onPageChange={({ selected: currentPage }) =>
                this.setState({ currentPage })
              }
              pageCount={pageCount}
            />
          )}
        </Content>
      </Main>
    );
  }
}
