import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import _Table from "../../src/components/Table";
import { ANSWER_STATE } from "../../src/constants";
import Button from "../../src/elements/Button";
import ContentTitle from "../../src/elements/ContentTitle";
import Subtitle from "../../src/elements/Subtitle";
import Title from "../../src/elements/Title";
import shortenAgreementName from "../../src/helpers/shortenAgreementName";
import AdminMainLayout from "../../src/layouts/AdminMain";
import numeral from "../../src/libs/customNumeral";
import customPostgrester from "../../src/libs/customPostgrester";

// TODO Clean these columns.
/* eslint-disable react/display-name */
const COLUMNS = [
  {
    Cell: ({ value }) => <span title={value}>{value}</span>,
    Header: "Nom",
    accessor: "name",
  },
  {
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    Header: "À rédiger",
    accessor: "todo",
  },
  {
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    Header: "En cours de rédaction",
    accessor: "draft",
  },
  {
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    Header: "À valider",
    accessor: "pendingReview",
  },
  {
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    Header: "En cours de validation",
    accessor: "underReview",
  },
  {
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    Header: "Validées",
    accessor: "validated",
  },
  {
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    Header: "Publiées",
    accessor: "published",
  },
  {
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    Header: "Total",
    accessor: "total",
  },
];
const PERCENTAGE_COLUMNS = [
  { ...COLUMNS[0] },
  {
    ...COLUMNS[1],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%")),
  },
  {
    ...COLUMNS[2],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%")),
  },
  {
    ...COLUMNS[3],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%")),
  },
  {
    ...COLUMNS[4],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%")),
  },
  {
    ...COLUMNS[5],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%")),
  },
  {
    ...COLUMNS[6],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%")),
  },
  {
    ...COLUMNS[7],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%")),
    sortable: false,
  },
];
/* eslint-enable react/display-name */

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;
const Table = styled(_Table)`
  font-size: 0.875rem;

  .rt-tr > .rt-th,
  .rt-tr > .rt-td {
    :first-of-type {
      width: 30% !important;
    }
    :not(:first-of-type) {
      width: 10% !important;
    }
  }

  .rt-tr > .rt-td {
    :first-of-type {
      cursor: help;
    }
    :not(:first-of-type) {
      text-align: right;
    }
  }
`;

const REFRESH_DELAY = 30000;

const StatsTable = ({ data, isPercentage, ...props }) => (
  <Table
    columns={isPercentage ? PERCENTAGE_COLUMNS : COLUMNS}
    data={data}
    filterable={false}
    multiSort={false}
    pageSize={data.length}
    resizable={false}
    showPagination={false}
    {...props}
  />
);

export default class AdminIndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agreementsStats: [],
      globalStats: [],
      isCalculating: true,
      isLoading: true,
      isPercentage: true,
      locationsStats: [],
    };
  }

  async componentDidMount() {
    this.postgrest = customPostgrester();

    await this.initializeStats();
    await this.updateStats();
  }

  componentWillUnmount() {
    if (this.timeout === undefined) return;

    clearTimeout(this.timeout);
  }

  async fetchLocations() {
    const { data: locations } = await this.postgrest
      .select("*")
      .select("agreements(id,idcc,name,parent_id)")
      .get("/locations");

    return locations;
  }

  async fetchAnswersForAgreements(agreementIds) {
    const { data: answers } = await this.postgrest
      .select("*")
      .select("agreement(*)")
      .in("agreement_id", agreementIds)
      .get("/answers");

    return answers;
  }

  async initializeStats() {
    const locations = await this.fetchLocations();

    const agreementsStats = locations
      .reduce((prev, { agreements }) => [...prev, ...agreements], [])
      .map(({ id, idcc, name, parent_id }) => ({
        id,
        isNational: parent_id === null,
        name: `[${idcc}] ${shortenAgreementName(name)}`,
        totals: [0, 0, 0, 0, 0, 0, 0],
      }));

    const locationsStats = locations.map(location => ({
      agreementIds: location.agreements.map(({ id }) => id),
      agreements: location.agreements,
      locationId: location.id,
      locationName: location.name,
    }));

    this.setState({
      agreementsStats,
      isLoading: false,
      locationsStats,
    });
  }

  async updateStats() {
    const { agreementsStats, locationsStats } = this.state;

    const nextAgreementsStats = agreementsStats.map(agreementsStatsEntry => ({
      ...agreementsStatsEntry,
      totals: [0, 0, 0, 0, 0, 0, 0],
    }));

    const nextlocationsStats = await Promise.all(
      locationsStats.map(async locationsStatsEntry => {
        const { agreementIds } = locationsStatsEntry;
        const answers = await this.fetchAnswersForAgreements(agreementIds);

        answers.forEach(({ agreement_id, is_published, state }) => {
          const agreementsStatsIndex = nextAgreementsStats.findIndex(
            ({ id }) => id === agreement_id,
          );

          switch (state) {
            case ANSWER_STATE.TO_DO:
              nextAgreementsStats[agreementsStatsIndex].totals[0] += 1;
              break;

            case ANSWER_STATE.DRAFT:
              nextAgreementsStats[agreementsStatsIndex].totals[1] += 1;
              break;

            case ANSWER_STATE.PENDING_REVIEW:
              nextAgreementsStats[agreementsStatsIndex].totals[2] += 1;
              break;

            case ANSWER_STATE.UNDER_REVIEW:
              nextAgreementsStats[agreementsStatsIndex].totals[3] += 1;
              break;

            case ANSWER_STATE.VALIDATED:
              nextAgreementsStats[agreementsStatsIndex].totals[4] += 1;
              break;
          }

          if (is_published) {
            nextAgreementsStats[agreementsStatsIndex].totals[5] += 1;
          }

          nextAgreementsStats[agreementsStatsIndex].totals[6] += 1;
        });

        const totals = answers.reduce(
          (totals, { is_published, state }) => {
            switch (state) {
              case ANSWER_STATE.TO_DO:
                totals[0] += 1;
                break;

              case ANSWER_STATE.DRAFT:
                totals[1] += 1;
                break;

              case ANSWER_STATE.PENDING_REVIEW:
                totals[2] += 1;
                break;

              case ANSWER_STATE.UNDER_REVIEW:
                totals[3] += 1;
                break;

              case ANSWER_STATE.VALIDATED:
                totals[4] += 1;
                break;
            }

            if (is_published) {
              totals[5] += 1;
            }

            totals[6] += 1;

            return totals;
          },
          [0, 0, 0, 0, 0, 0, 0],
        );

        return {
          ...locationsStatsEntry,
          totals,
        };
      }),
    );

    const nextGlobalStats = nextlocationsStats.reduce(
      (globalTotals, { totals }) => [
        globalTotals[0] + totals[0],
        globalTotals[1] + totals[1],
        globalTotals[2] + totals[2],
        globalTotals[3] + totals[3],
        globalTotals[4] + totals[4],
        globalTotals[5] + totals[5],
        globalTotals[6] + totals[6],
      ],
      [0, 0, 0, 0, 0, 0, 0],
    );

    this.setState({
      agreementsStats: nextAgreementsStats,
      globalStats: nextGlobalStats,
      isCalculating: false,
      locationsStats: nextlocationsStats,
    });

    this.timeout = setTimeout(this.updateStats.bind(this), REFRESH_DELAY);
  }

  generateDataRow(name, stats, isCalculating) {
    const { isPercentage } = this.state;

    if (isCalculating) {
      return {
        draft: -1,
        name,
        pendingReview: -1,
        published: -1,
        todo: -1,
        total: -1,
        underReview: -1,
        validated: -1,
      };
    }

    return {
      draft: isPercentage ? stats[1] / stats[6] : stats[1],
      name,
      pendingReview: isPercentage ? stats[2] / stats[6] : stats[2],
      published: isPercentage ? stats[5] / stats[6] : stats[5],
      todo: isPercentage ? stats[0] / stats[6] : stats[0],
      total: isPercentage ? 1 : stats[6],
      underReview: isPercentage ? stats[3] / stats[6] : stats[3],
      validated: isPercentage ? stats[4] / stats[6] : stats[4],
    };
  }

  getGlobalStats() {
    const { globalStats, isCalculating, isPercentage } = this.state;
    const data = [this.generateDataRow("Total", globalStats, isCalculating)];

    return <StatsTable data={data} isPercentage={isPercentage} sortable={false} />;
  }

  getLocationsStats() {
    const { isCalculating, isPercentage, locationsStats } = this.state;
    const data = locationsStats.map(({ locationName, totals }) =>
      this.generateDataRow(locationName, totals, isCalculating),
    );

    return (
      <StatsTable
        data={data}
        defaultSorted={[{ desc: false, id: "published" }]}
        isPercentage={isPercentage}
      />
    );
  }

  getAgreementsStats(isNational = false) {
    const { agreementsStats, isCalculating, isPercentage } = this.state;
    const data = agreementsStats
      .filter(agreement => agreement.isNational === isNational)
      .map(({ name, totals }) => this.generateDataRow(name, totals, isCalculating));

    return (
      <StatsTable
        data={data}
        defaultSorted={[{ desc: false, id: "name" }]}
        isPercentage={isPercentage}
      />
    );
  }

  render() {
    const { isLoading, isPercentage } = this.state;

    return (
      <AdminMainLayout>
        <Container flexDirection="column">
          <Flex alignItems="baseline" justifyContent="space-between">
            <Title>Tableau de bord</Title>
            <Button onClick={() => this.setState({ isPercentage: !isPercentage })}>
              {isPercentage ? "Voir les nombres bruts" : "Voir les pourcentages"}
            </Button>
          </Flex>

          <Subtitle isFirst>Global</Subtitle>
          {isLoading ? <p>Calcul en cours…</p> : this.getGlobalStats()}

          <Subtitle>Par unité régionale</Subtitle>
          {isLoading ? <p>Calcul en cours…</p> : this.getLocationsStats()}

          <Subtitle>Par convention collective</Subtitle>
          <ContentTitle isFirst>Conventions nationales</ContentTitle>
          {isLoading ? <p>Calcul en cours…</p> : this.getAgreementsStats(true)}
          <ContentTitle>Conventions locales</ContentTitle>
          {isLoading ? <p>Calcul en cours…</p> : this.getAgreementsStats()}
        </Container>
      </AdminMainLayout>
    );
  }
}
