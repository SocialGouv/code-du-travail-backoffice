import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import * as C from "../../../src/constants";
import LoadingSpinner from "../../../src/elements/LoadingSpinner";
import _Table from "../../../src/elements/Table";
import Title from "../../../src/elements/Title";
import shortenAgreementName from "../../../src/helpers/shortenAgreementName";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import numeral from "../../../src/libs/customNumeral";
import customPostgrester from "../../../src/libs/customPostgrester";
import dilaApi from "../../../src/libs/dilaApi";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;

const Table = styled(_Table)`
  display: fles;
  flex-grow: 1;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  overflow-y: auto;

  .rt-tr > .rt-th,
  .rt-tr > .rt-td {
    :first-of-type {
      width: 50% !important;
    }
    :not(:first-of-type) {
      width: 50% !important;
    }
  }

  .rt-tr > .rt-td {
    :first-of-type {
      cursor: pointer;
    }
    :not(:first-of-type) {
      text-align: right;
    }
  }
`;

// TODO Clean these columns.
/* eslint-disable react/display-name */
const DASHBOARD_TABLE_COLUMNS = [
  {
    Cell: ({ row, value }) => {
      return (
        <span
          onClick={() => window.open(`/admin/tracker/${row._original.id}`)}
          onKeyPress={() => window.open(`/admin/tracker/${row._original.id}`)}
          role="link"
          tabIndex="0"
          title={value}
        >
          {value}
        </span>
      );
    },
    Header: "Convention",
    accessor: "name",
  },
  {
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    Header: "Nombre de références obsolètes",
    accessor: "total",
  },
];
/* eslint-enable react/display-name */

class AdminTrackerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answersReferencesStats: [],
      isLoading: true,
      selectedAgreementOption: null,
    };
  }

  async componentDidMount() {
    this.postgrest = customPostgrester();

    await this.initializeStats();
    await this.updateStats();
  }

  async initializeStats() {
    const { data: locations } = await this.postgrest
      .select("*")
      .select("agreements(id,idcc,name,parent_id)")
      .get("/locations");

    const answersReferencesStats = locations
      .reduce((prev, { agreements }) => [...prev, ...agreements], [])
      .filter(({ parent_id }) => parent_id === null)
      .map(({ id, idcc, name }) => ({
        id,
        name: `[${idcc}] ${shortenAgreementName(name)}`,
        total: -1,
      }));

    this.setState({
      answersReferencesStats: [
        {
          id: null,
          name: `[Code du travail] Réponses génériques`,
          total: -1,
        },
        ...answersReferencesStats,
      ],
      isLoading: false,
    });
  }

  async fetchAnswersForAgreement(agreementId) {
    const { data: answers } = await this.postgrest.eq("agreement_id", agreementId).get("/answers");

    return answers;
  }

  async findObsoleteAnswersReferences(answersReferences) {
    // TODO Remove `dila_cid !== null` check once all the references are cleaned.
    const localAgreementAnswersReferences = answersReferences.filter(
      ({ category, dila_cid }) =>
        category === C.ANSWER_REFERENCE_CATEGORY.AGREEMENT && dila_cid !== null,
    );
    const localCodeAnswersReferences = answersReferences.filter(
      ({ category, dila_cid }) =>
        category === C.ANSWER_REFERENCE_CATEGORY.LABOR_CODE && dila_cid !== null,
    );

    const obsoleteAgreementAnswersReference = [];
    for (const localAgreementAnswerReference of localAgreementAnswersReferences) {
      try {
        const { dila_id } = localAgreementAnswerReference;
        await dilaApi.get(`/agreement/articles?articleIdsOrCids=${dila_id}`);
      } catch (err) {
        obsoleteAgreementAnswersReference.push(localAgreementAnswerReference);
      }
    }
    const obsoleteCodeAnswersReference = [];
    for (const localCodeAnswerReference of localCodeAnswersReferences) {
      try {
        const { dila_id } = localCodeAnswerReference;
        await dilaApi.get(`/code/articles?articleIdsOrCids=${dila_id}`);
      } catch (err) {
        obsoleteAgreementAnswersReference.push(localCodeAnswerReference);
      }
    }

    return [...obsoleteAgreementAnswersReference, ...obsoleteCodeAnswersReference];
  }

  async updateStats() {
    const { answersReferencesStats } = this.state;

    const { length } = answersReferencesStats;
    let index = -1;
    while (++index < length) {
      const { answersReferencesStats } = this.state;
      const nextAnswersReferencesStats = [...answersReferencesStats];
      const { id: agreementId } = answersReferencesStats[index];

      const { data: answers } =
        agreementId !== null
          ? await this.postgrest.eq("agreement_id", agreementId).get("/answers")
          : await this.postgrest.is("agreement_id", null).get("/answers");

      const answerIds = answers.map(({ id }) => id);
      const { data: answersReferences } = await this.postgrest
        .in("answer_id", answerIds)
        .get("/answers_references");

      const obsoleteAnswersReferences = await this.findObsoleteAnswersReferences(answersReferences);

      nextAnswersReferencesStats[index].total = obsoleteAnswersReferences.length;

      this.setState({
        answersReferencesStats: nextAnswersReferencesStats,
      });
    }
  }

  renderDashboard() {
    const { answersReferencesStats, isLoading } = this.state;

    if (isLoading) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <LoadingSpinner />
        </Flex>
      );
    }

    return (
      <Table
        columns={DASHBOARD_TABLE_COLUMNS}
        data={answersReferencesStats}
        defaultSorted={[{ desc: true, id: "total" }]}
        filterable={false}
        multiSort={false}
        pageSize={answersReferencesStats.length}
        resizable={false}
        showPagination={false}
      />
    );
  }

  render() {
    return (
      <AdminMainLayout hasBareContent>
        <Container flexDirection="column" flexGrow="1">
          <Flex alignItems="center" justifyContent="space-between">
            <Title>Tableau de veille</Title>
          </Flex>

          {this.renderDashboard()}
        </Container>
      </AdminMainLayout>
    );
  }
}

export default AdminTrackerPage;
