import Router from "next/router";
import { toPairs } from "ramda";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import AdminAnswer from "../../src/blocks/AdminAnswer";
import Subtitle from "../../src/elements/Subtitle";
import Title from "../../src/elements/Title";
import AdminMain from "../../src/layouts/AdminMain";
import customAxios from "../../src/libs/customAxios";

import { ANSWER_STATE } from "../../src/constants";

import "../../node_modules/react-table/react-table.css";
import Idcc from "../../src/elements/Idcc";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;

const Table = styled.table`
  border-collapse: collapse;

  tr > th {
    background-color: var(--color-label-background);
    width: 6rem;

    :first-child {
      width: auto;
    }
  }

  tr > td,
  tr > th {
    border: solid 1px var(--color-border);
    border-left: 0;
    border-top: 0;
    padding: 0.25rem 0.5rem;
    text-align: left;
    white-space: nowrap;
  }
  tr:first-child > td,
  tr:first-child > th {
    border-top: solid 1px var(--color-border);
  }
  tr > td:first-child,
  tr > th:first-child {
    border-left: solid 1px var(--color-border);
  }

  tr > td:nth-child(n + 2) {
    text-align: right;
  }
`;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      lastAnswers: []
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    try {
      const lastAnswers = await this.fetchLastAnswers();

      const questionsCount = await this.countQuestions();
      const locations = await this.fetchLocations();
      const locationsAgreements = await this.fetchLocationsAgreement();

      const locationsIds = locations.map(({ id }) => id);
      const stats = locations.reduce((prev, location) => {
        prev[location.id] = {
          ...location,
          agreements: []
        };

        return prev;
      }, {});
      for (let locationAgreement of locationsAgreements) {
        const locationId = locationAgreement.location_id;
        if (!locationsIds.includes(locationId)) continue;

        const answers = await this.fetchAnswersForAgreement(
          locationAgreement.agreement_id
        );

        stats[locationId].agreements.push([
          locationAgreement.agreement,
          answers.filter(({ state }) => state === ANSWER_STATE.TO_DO).length,
          answers.filter(({ state }) => state === ANSWER_STATE.DRAFT).length,
          answers.filter(({ state }) => state === ANSWER_STATE.PENDING_REVIEW)
            .length,
          answers.filter(({ state }) => state === ANSWER_STATE.VALIDATED).length
        ]);
      }

      this.setState({
        isLoading: false,
        lastAnswers,
        questionsCount,
        stats: toPairs(stats)
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  async fetchLastAnswers() {
    const select =
      "select=*,question(index,value),agreement(idcc,name),user(name)";
    const where = "user_id=not.is.null&order=updated_at.desc&limit=5";
    const order = "order=updated_at.desc";
    const limit = "limit=5";

    const { data: lastAnswers } = await this.axios.get(
      `/answers?${select}&${where}&${order}&${limit}`
    );

    return lastAnswers;
  }

  async countQuestions() {
    const select = "select=id*";

    const { data: questions } = await this.axios.get(`/questions?${select}`);

    return questions.length;
  }

  async fetchLocations() {
    const where = "name=ilike.UR*";
    const order = "order=name.asc";

    const { data: locations } = await this.axios.get(
      `/locations?${where}&${order}`
    );

    return locations;
  }

  async fetchLocationsAgreement() {
    const select = "select=*,agreement(idcc,name)";

    const { data: locationsAgreements } = await this.axios.get(
      `/locations_agreements?${select}`
    );

    return locationsAgreements;
  }

  async fetchAnswersForAgreement(agreementId) {
    const select = "select=state";
    const where = `agreement_id=eq.${agreementId}`;

    const { data: locationsAgreements } = await this.axios.get(
      `/answers?${select}&${where}`
    );

    return locationsAgreements;
  }

  editAnswer(id) {
    Router.push(
      {
        pathname: `/admin/answers/edit`,
        query: { id }
      },
      `/admin/answers/${id}`
    );
  }

  getStats() {
    return this.state.stats
      .map(([, row], index) => {
        if (row.agreements.length === 0) return [];

        const locationTableRow = [
          <tr key={`${index}-0`}>
            <td
              rowSpan={row.agreements.length}
              style={{ fontWeight: 600, verticalAlign: "top" }}
            >
              {row.name}
            </td>
            <td>
              <Idcc
                code={row.agreements[0][0].idcc}
                name={row.agreements[0][0].name}
              />
            </td>
            <td>{row.agreements[0][1]}</td>
            <td>{row.agreements[0][2]}</td>
            <td>{row.agreements[0][3]}</td>
            <td>{row.agreements[0][4]}</td>
          </tr>
        ];

        if (row.agreements.length === 1) return locationTableRow;

        return [
          ...locationTableRow,
          row.agreements.slice(1).map((agreement, subindex) => {
            const keyIndex = subindex + 1;

            return (
              <tr key={`${index}-${keyIndex}`}>
                <td>
                  <Idcc
                    code={row.agreements[keyIndex][0].idcc}
                    name={row.agreements[keyIndex][0].name}
                  />
                </td>
                <td>{row.agreements[keyIndex][1]}</td>
                <td>{row.agreements[keyIndex][2]}</td>
                <td>{row.agreements[keyIndex][3]}</td>
                <td>{row.agreements[keyIndex][4]}</td>
              </tr>
            );
          })
        ];
      })
      .flat();
  }

  render() {
    if (this.state.isLoading) return <AdminMain isLoading />;

    return (
      <AdminMain>
        <Container flexDirection="column">
          <Title>Tableau de bord</Title>

          <Subtitle isFirst>{`État d'avancement des réponses`}</Subtitle>
          <Table>
            <thead>
              <tr>
                <th>Unité</th>
                <th>Convention</th>
                <th>À rédiger</th>
                <th>Brouillons</th>
                <th>À valider</th>
                <th>Validées</th>
              </tr>
            </thead>
            <tbody>{this.getStats()}</tbody>
          </Table>

          <Subtitle isFirst>Dernières réponses modifiées</Subtitle>
          {this.state.lastAnswers.map((answer, index) => (
            <AdminAnswer
              data={answer}
              key={index}
              onClick={this.editAnswer.bind(this)}
            />
          ))}
        </Container>
      </AdminMain>
    );
  }
}
