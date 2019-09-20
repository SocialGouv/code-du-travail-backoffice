import numeral from "numeral";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Subtitle from "../../src/elements/Subtitle";
import Title from "../../src/elements/Title";
import AdminMain from "../../src/layouts/AdminMain";
import customAxios from "../../src/libs/customAxios";

import { ANSWER_STATE } from "../../src/constants";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;

const Table = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;

  tr > th {
    background-color: var(--color-label-background);
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: top;
    width: 10%;
    white-space: nowrap;

    :first-child {
      width: 40%;
    }
  }

  tr > td,
  tr > th {
    border: solid 1px var(--color-border);
    border-left: 0;
    border-top: 0;
    padding: 0.25rem 0.5rem;
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
  tr > th.title {
    background-color: var(--color-text-blue);
    color: white;
    text-align: right;
  }
`;

const REFRESH_DELAY = 10000;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      questionsCount: 0,
      statsAgreements: [],
      statsLocations: [],
      statsGlobal: [0, 0, 0, 0, 0, 0]
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    await this.updateStats();
  }

  async updateStats() {
    try {
      const questionsCount = await this.countQuestions();
      const activeLocations = await this.fetchActiveLocations();
      const locationsAgreements = await this.fetchLocationsAgreement();

      let statsGlobal = [0, 0, 0, 0, 0, 0];
      const statsLocations = activeLocations.map(location => ({
        ...location,
        stats: [0, 0, 0, 0, 0, 0]
      }));
      const statsAgreements = locationsAgreements.map(agreement => ({
        ...agreement,
        stats: [0, 0, 0, 0, 0, 0]
      }));

      const activeLocationsIds = activeLocations.map(({ id }) => id);
      for (const locationAgreement of locationsAgreements) {
        const currentLocationId = locationAgreement.location_id;
        if (!activeLocationsIds.includes(currentLocationId)) continue;

        const answers = await this.fetchAnswersForAgreement(
          locationAgreement.agreement_id
        );

        const todoAnswersCount = answers.filter(
          ({ state }) => state === ANSWER_STATE.TO_DO
        ).length;
        const draftAnswersCount = answers.filter(
          ({ state }) => state === ANSWER_STATE.DRAFT
        ).length;
        const pendingReviewAnswersCount = answers.filter(
          ({ state }) => state === ANSWER_STATE.PENDING_REVIEW
        ).length;
        const underReviewAnswersCount = answers.filter(
          ({ state }) => state === ANSWER_STATE.UNDER_REVIEW
        ).length;
        const validatedAnswersCount = answers.filter(
          ({ state }) => state === ANSWER_STATE.VALIDATED
        ).length;
        const totalAnswersCount =
          todoAnswersCount +
          draftAnswersCount +
          pendingReviewAnswersCount +
          underReviewAnswersCount +
          validatedAnswersCount;

        statsGlobal = [
          statsGlobal[0] + todoAnswersCount,
          statsGlobal[1] + draftAnswersCount,
          statsGlobal[2] + pendingReviewAnswersCount,
          statsGlobal[3] + underReviewAnswersCount,
          statsGlobal[4] + validatedAnswersCount,
          statsGlobal[5] + totalAnswersCount
        ];

        const statsLocationIndex = statsLocations.findIndex(
          ({ id }) => id === currentLocationId
        );
        const currentLocationStats = statsLocations[statsLocationIndex].stats;
        statsLocations[statsLocationIndex].stats = [
          currentLocationStats[0] + todoAnswersCount,
          currentLocationStats[1] + draftAnswersCount,
          currentLocationStats[2] + pendingReviewAnswersCount,
          currentLocationStats[3] + underReviewAnswersCount,
          currentLocationStats[4] + validatedAnswersCount,
          currentLocationStats[5] + totalAnswersCount
        ];

        const statsAgreementIndex = statsAgreements.findIndex(
          ({ agreement_id }) => agreement_id === locationAgreement.agreement_id
        );
        statsAgreements[statsAgreementIndex].stats = [
          todoAnswersCount,
          draftAnswersCount,
          pendingReviewAnswersCount,
          underReviewAnswersCount,
          validatedAnswersCount,
          totalAnswersCount
        ];
      }

      this.setState({
        isLoading: false,
        questionsCount,
        statsAgreements,
        statsGlobal,
        statsLocations
      });

      setTimeout(this.updateStats.bind(this), REFRESH_DELAY);
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  async countQuestions() {
    const select = "select=id*";

    const { data: questions } = await this.axios.get(`/questions?${select}`);

    return questions.length;
  }

  async fetchActiveLocations() {
    const where = "name=ilike.UR*";
    const order = "order=name.asc";

    const { data: locations } = await this.axios.get(
      `/locations?${where}&${order}`
    );

    return locations;
  }

  async fetchLocationsAgreement() {
    const select = "select=*,agreement(idcc,name),location(name)";
    const order = "agreement.order=idcc.asc";

    const { data: locationsAgreements } = await this.axios.get(
      `/locations_agreements?${select}&${order}`
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

  getGlobalStats() {
    const { statsGlobal } = this.state;

    return (
      <tr>
        <th>Total</th>
        <td>
          {statsGlobal[0]}
          <br />
          {numeral(statsGlobal[0] / statsGlobal[5]).format("0%")}
        </td>
        <td>
          {statsGlobal[1]}
          <br />
          {numeral(statsGlobal[1] / statsGlobal[5]).format("0%")}
        </td>
        <td>
          {statsGlobal[2]}
          <br />
          {numeral(statsGlobal[2] / statsGlobal[5]).format("0%")}
        </td>
        <td>
          {statsGlobal[3]}
          <br />
          {numeral(statsGlobal[3] / statsGlobal[5]).format("0%")}
        </td>
        <td>
          {statsGlobal[4]}
          <br />
          {numeral(statsGlobal[4] / statsGlobal[5]).format("0%")}
        </td>
        <td>
          {statsGlobal[5]}
          <br />
          100%
        </td>
      </tr>
    );
  }

  getUnitsStats() {
    const { statsLocations } = this.state;

    return statsLocations.map((statsLocation, index) => (
      <tr key={index}>
        <th title={statsLocation.name}>{statsLocation.name}</th>
        <td>
          {statsLocation.stats[0]}
          <br />
          {numeral(statsLocation.stats[0] / statsLocation.stats[5]).format(
            "0%"
          )}
        </td>
        <td>
          {statsLocation.stats[1]}
          <br />
          {numeral(statsLocation.stats[1] / statsLocation.stats[5]).format(
            "0%"
          )}
        </td>
        <td>
          {statsLocation.stats[2]}
          <br />
          {numeral(statsLocation.stats[2] / statsLocation.stats[5]).format(
            "0%"
          )}
        </td>
        <td>
          {statsLocation.stats[3]}
          <br />
          {numeral(statsLocation.stats[3] / statsLocation.stats[5]).format(
            "0%"
          )}
        </td>
        <td>
          {statsLocation.stats[4]}
          <br />
          {numeral(statsLocation.stats[4] / statsLocation.stats[5]).format(
            "0%"
          )}
        </td>
        <td>
          {statsLocation.stats[5]}
          <br />
          100%
        </td>
      </tr>
    ));
  }

  getAgreementsStats() {
    const { statsAgreements } = this.state;
    let lastLocationId = "";

    return statsAgreements.map((statsAgreement, index) => {
      const { idcc, name } = statsAgreement.agreement;
      const title = `[${idcc}] ${name}`;

      const agreementRowSource = (
        <tr key={`agreement-${index}`}>
          <th title={title}>{title}</th>
          <td>
            {statsAgreement.stats[0]}
            <br />
            {numeral(statsAgreement.stats[0] / statsAgreement.stats[5]).format(
              "0%"
            )}
          </td>
          <td>
            {statsAgreement.stats[1]}
            <br />
            {numeral(statsAgreement.stats[1] / statsAgreement.stats[5]).format(
              "0%"
            )}
          </td>
          <td>
            {statsAgreement.stats[2]}
            <br />
            {numeral(statsAgreement.stats[2] / statsAgreement.stats[5]).format(
              "0%"
            )}
          </td>
          <td>
            {statsAgreement.stats[3]}
            <br />
            {numeral(statsAgreement.stats[3] / statsAgreement.stats[5]).format(
              "0%"
            )}
          </td>
          <td>
            {statsAgreement.stats[4]}
            <br />
            {numeral(statsAgreement.stats[4] / statsAgreement.stats[5]).format(
              "0%"
            )}
          </td>
          <td>
            {statsAgreement.stats[5]}
            <br />
            100%
          </td>
        </tr>
      );

      if (lastLocationId !== statsAgreement.location_id) {
        lastLocationId = statsAgreement.location_id;

        return [
          <tr key={`location-${index}`}>
            <th className="title" colSpan={7} title={title}>
              {statsAgreement.location.name.toUpperCase()}
            </th>
          </tr>,
          agreementRowSource
        ];
      }

      return agreementRowSource;
    });
  }

  render() {
    return (
      <AdminMain>
        <Container flexDirection="column">
          <Title>Tableau de bord</Title>

          <Subtitle isFirst>Global</Subtitle>
          <Table>
            <thead>
              <tr>
                <th />
                <th title="À rédiger">À rédiger</th>
                <th title="En cours de rédaction">En cours de rédaction</th>
                <th title="À valider">À valider</th>
                <th title="En cours de validation">En cours de validation</th>
                <th title="Validées">Validées</th>
                <th title="Total">Total</th>
              </tr>
            </thead>
            <tbody>
              {this.state.isLoading ? (
                <tr>
                  <td colSpan="6">Calcul en cours…</td>
                </tr>
              ) : (
                this.getGlobalStats()
              )}
            </tbody>
          </Table>

          <Subtitle isFirst>Par région</Subtitle>
          <Table>
            <thead>
              <tr>
                <th title="Région">Région</th>
                <th title="À rédiger">À rédiger</th>
                <th title="En cours de rédaction">En cours de rédaction</th>
                <th title="À valider">À valider</th>
                <th title="En cours de validation">En cours de validation</th>
                <th title="Validées">Validées</th>
                <th title="Total">Total</th>
              </tr>
            </thead>
            <tbody>
              {this.state.isLoading ? (
                <tr>
                  <td colSpan="6">Calcul en cours…</td>
                </tr>
              ) : (
                this.getUnitsStats()
              )}
            </tbody>
          </Table>

          <Subtitle isFirst>Par convention collective</Subtitle>
          <Table>
            <thead>
              <tr>
                <th title="Intitulé">Intitulé</th>
                <th title="À rédiger">À rédiger</th>
                <th title="En cours de rédaction">En cours de rédaction</th>
                <th title="À valider">À valider</th>
                <th title="En cours de validation">En cours de validation</th>
                <th title="Validées">Validées</th>
                <th title="Total">Total</th>
              </tr>
            </thead>
            <tbody>
              {this.state.isLoading ? (
                <tr>
                  <td colSpan="6">Calcul en cours…</td>
                </tr>
              ) : (
                this.getAgreementsStats()
              )}
            </tbody>
          </Table>
        </Container>
      </AdminMain>
    );
  }
}
