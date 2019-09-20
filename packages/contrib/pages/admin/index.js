import numeral from "numeral";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Table from "../../src/components/Table";
import Button from "../../src/elements/Button";
import ContentTitle from "../../src/elements/ContentTitle";
import Subtitle from "../../src/elements/Subtitle";
import Title from "../../src/elements/Title";
import AdminMain from "../../src/layouts/AdminMain";
import customAxios from "../../src/libs/customAxios";

import { ANSWER_STATE } from "../../src/constants";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: "name",
    id: "name"
  },
  {
    Header: "À rédiger",
    accessor: "todo",
    id: "todo"
  },
  {
    Header: "En cours de rédaction",
    accessor: "draft",
    id: "draft"
  },
  {
    Header: "À valider",
    accessor: "pendingReview",
    id: "pendingReview"
  },
  {
    Header: "En cours de validation",
    accessor: "underReview",
    id: "underReview"
  },
  {
    Header: "Validées",
    accessor: "validated",
    id: "validated"
  },
  {
    Header: "Total",
    accessor: "total",
    id: "total"
  }
];
const PERCENTAGE_COLUMNS = [
  {
    ...COLUMNS[0],
    accessor: data => data.name
  },
  {
    ...COLUMNS[1],
    accessor: data => numeral(data.todo).format("0.00%")
  },
  {
    ...COLUMNS[2],
    accessor: data => numeral(data.draft).format("0.00%")
  },
  {
    ...COLUMNS[3],
    accessor: data => numeral(data.pendingReview).format("0.00%")
  },
  {
    ...COLUMNS[4],
    accessor: data => numeral(data.underReview).format("0.00%")
  },
  {
    ...COLUMNS[5],
    accessor: data => numeral(data.validated).format("0.00%")
  },
  {
    ...COLUMNS[6],
    accessor: () => "100%",
    sortable: false
  }
];

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;

const REFRESH_DELAY = 10000;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isPercentage: true,
      questionsCount: 0,
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
        agreements: [],
        total: [0, 0, 0, 0, 0, 0]
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
        const currentLocationStats = statsLocations[statsLocationIndex];
        currentLocationStats.total[0] += todoAnswersCount;
        currentLocationStats.total[1] += draftAnswersCount;
        statsLocations[
          statsLocationIndex
        ].total[2] += pendingReviewAnswersCount;
        currentLocationStats.total[3] += underReviewAnswersCount;
        currentLocationStats.total[4] += validatedAnswersCount;
        currentLocationStats.total[5] += totalAnswersCount;

        const currentLocationAgreement = locationsAgreements.find(
          ({ agreement_id }) => agreement_id === locationAgreement.agreement_id
        );
        currentLocationAgreement.total = [
          todoAnswersCount,
          draftAnswersCount,
          pendingReviewAnswersCount,
          underReviewAnswersCount,
          validatedAnswersCount,
          totalAnswersCount
        ];
        currentLocationStats.agreements.push(currentLocationAgreement);
      }

      this.setState({
        isLoading: false,
        questionsCount,
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

    const { data: locations } = await this.axios.get(`/locations?${where}`);

    return locations;
  }

  async fetchLocationsAgreement() {
    const select = "select=*,agreement(idcc,name),location(name)";

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

  generateDataRow(name, stats) {
    const { isPercentage } = this.state;

    return {
      name,
      todo: isPercentage ? stats[0] / stats[5] : stats[0],
      draft: isPercentage ? stats[1] / stats[5] : stats[1],
      pendingReview: isPercentage ? stats[2] / stats[5] : stats[2],
      underReview: isPercentage ? stats[3] / stats[5] : stats[3],
      validated: isPercentage ? stats[4] / stats[5] : stats[4],
      total: isPercentage ? 1 : stats[5]
    };
  }

  getGlobalStats() {
    const { isPercentage, statsGlobal } = this.state;
    const data = [this.generateDataRow("Total", statsGlobal)];

    return (
      <Table
        data={data}
        defaultPageSize={data.length}
        columns={isPercentage ? PERCENTAGE_COLUMNS : COLUMNS}
        filterable={false}
        multiSort={false}
        resizable={false}
        sortable={false}
        showPagination={false}
      />
    );
  }

  getUnitsStats() {
    const { isPercentage, statsLocations } = this.state;

    const data = statsLocations.map(({ name, total }) =>
      this.generateDataRow(name, total)
    );

    return (
      <Table
        data={data}
        defaultPageSize={data.length}
        defaultSorted={[{ id: "validated", desc: false }]}
        columns={isPercentage ? PERCENTAGE_COLUMNS : COLUMNS}
        filterable={false}
        multiSort={false}
        resizable={false}
        showPagination={false}
      />
    );
  }

  getAgreementsStats() {
    const { isPercentage, statsLocations } = this.state;

    return statsLocations
      .filter(({ agreements }) => agreements.length !== 0)
      .map(({ agreements, name }, index) => {
        const data = agreements.map(({ agreement: { name }, total }) =>
          this.generateDataRow(name, total)
        );

        return (
          <div key={index}>
            <ContentTitle isFirst={index === 0}>{name}</ContentTitle>
            <Table
              data={data}
              defaultPageSize={data.length}
              defaultSorted={[{ id: "validated", desc: false }]}
              columns={isPercentage ? PERCENTAGE_COLUMNS : COLUMNS}
              filterable={false}
              multiSort={false}
              resizable={false}
              showPagination={false}
            />
          </div>
        );
      });
  }

  render() {
    const { isPercentage } = this.state;

    return (
      <AdminMain>
        <Container flexDirection="column">
          <Flex alignItems="baseline" justifyContent="space-between">
            <Title>Tableau de bord</Title>
            <Button
              onClick={() => this.setState({ isPercentage: !isPercentage })}
            >
              {isPercentage
                ? "Voir les nombres bruts"
                : "Voir les pourcentages"}
            </Button>
          </Flex>

          <Subtitle isFirst>Global</Subtitle>
          {this.state.isLoading ? (
            <tr>
              <p>Calcul en cours…</p>
            </tr>
          ) : (
            this.getGlobalStats()
          )}

          <Subtitle>Par région</Subtitle>
          {this.state.isLoading ? (
            <tr>
              <p>Calcul en cours…</p>
            </tr>
          ) : (
            this.getUnitsStats()
          )}

          <Subtitle>Par convention collective</Subtitle>
          {this.state.isLoading ? (
            <p>Calcul en cours…</p>
          ) : (
            this.getAgreementsStats()
          )}
        </Container>
      </AdminMain>
    );
  }
}
