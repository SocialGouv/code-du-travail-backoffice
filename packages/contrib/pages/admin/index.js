import React from "react";
import ReactTooltip from "react-tooltip";
import { Flex } from "rebass";
import styled from "styled-components";

import _Table from "../../src/components/Table";
import Button from "../../src/elements/Button";
import ContentTitle from "../../src/elements/ContentTitle";
import Subtitle from "../../src/elements/Subtitle";
import Title from "../../src/elements/Title";
import AdminMain from "../../src/layouts/AdminMain";
import customAxios from "../../src/libs/customAxios";
import numeral from "../../src/libs/customNumeral";

import { ANSWER_STATE } from "../../src/constants";

const Tooltip = styled(ReactTooltip)`
  max-width: 22rem;
  padding: 0.25rem 0.5rem 0.45rem;
  white-space: normal;
`;

const COLUMNS = [
  {
    Header: "Nom",
    Cell: ({ value }) => (
      <div data-tip={value}>
        {value}
        <Tooltip />
      </div>
    ),
    accessor: "name"
  },
  {
    Header: "À rédiger",
    Cell: ({ value }) => numeral(value).format("0,0"),
    accessor: "todo"
  },
  {
    Header: "En cours de rédaction",
    Cell: ({ value }) => numeral(value).format("0,0"),
    accessor: "draft"
  },
  {
    Header: "À valider",
    Cell: ({ value }) => numeral(value).format("0,0"),
    accessor: "pendingReview"
  },
  {
    Header: "En cours de validation",
    Cell: ({ value }) => numeral(value).format("0,0"),
    accessor: "underReview"
  },
  {
    Header: "Validées",
    Cell: ({ value }) => numeral(value).format("0,0"),
    accessor: "validated"
  },
  {
    Header: "Total",
    Cell: ({ value }) => numeral(value).format("0,0"),
    accessor: "total"
  }
];
const PERCENTAGE_COLUMNS = [
  { ...COLUMNS[0] },
  {
    ...COLUMNS[1],
    Cell: ({ value }) => numeral(value).format("0.00%")
  },
  {
    ...COLUMNS[2],
    Cell: ({ value }) => numeral(value).format("0.00%")
  },
  {
    ...COLUMNS[3],
    Cell: ({ value }) => numeral(value).format("0.00%")
  },
  {
    ...COLUMNS[4],
    Cell: ({ value }) => numeral(value).format("0.00%")
  },
  {
    ...COLUMNS[5],
    Cell: ({ value }) => numeral(value).format("0.00%")
  },
  {
    ...COLUMNS[6],
    Cell: ({ value }) => numeral(value).format("0.00%"),
    sortable: false
  }
];

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;
const Table = styled(_Table)`
  .rt-tr > .rt-td {
    :first-child {
      cursor: help;
    }
    :not(:first-child) {
      text-align: right;
    }
  }
`;

const REFRESH_DELAY = 30000;

const StatsTable = ({ data, isPercentage, ...props }) => (
  <Table
    data={data}
    defaultPageSize={data.length}
    columns={isPercentage ? PERCENTAGE_COLUMNS : COLUMNS}
    filterable={false}
    multiSort={false}
    resizable={false}
    showPagination={false}
    {...props}
  />
);

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
    const total = stats[5] !== 0 ? stats[5] : 1;

    return {
      name,
      todo: isPercentage ? stats[0] / total : stats[0],
      draft: isPercentage ? stats[1] / total : stats[1],
      pendingReview: isPercentage ? stats[2] / total : stats[2],
      underReview: isPercentage ? stats[3] / total : stats[3],
      validated: isPercentage ? stats[4] / total : stats[4],
      total: isPercentage ? 1 : stats[5]
    };
  }

  getGlobalStats() {
    const { isPercentage, statsGlobal } = this.state;
    const data = [this.generateDataRow("Total", statsGlobal)];

    return (
      <StatsTable data={data} isPercentage={isPercentage} sortable={false} />
    );
  }

  getUnitsStats() {
    const { isPercentage, statsLocations } = this.state;

    const data = statsLocations.map(({ name, total }) =>
      this.generateDataRow(name, total)
    );

    return (
      <StatsTable
        data={data}
        defaultSorted={[{ id: "validated", desc: false }]}
        isPercentage={isPercentage}
      />
    );
  }

  getAgreementsStats() {
    const { isPercentage, statsLocations } = this.state;

    return statsLocations
      .filter(({ agreements }) => agreements.length !== 0)
      .map(({ agreements, name }, index) => {
        const data = agreements.map(({ agreement: { idcc, name }, total }) =>
          this.generateDataRow(`[${idcc}] ${name}`, total)
        );

        return (
          <div key={index}>
            <ContentTitle isFirst={index === 0}>{name}</ContentTitle>
            <StatsTable
              data={data}
              defaultSorted={[{ id: "validated", desc: false }]}
              isPercentage={isPercentage}
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
            <p>Calcul en cours…</p>
          ) : (
            this.getGlobalStats()
          )}

          <Subtitle>Par région</Subtitle>
          {this.state.isLoading ? (
            <p>Calcul en cours…</p>
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
