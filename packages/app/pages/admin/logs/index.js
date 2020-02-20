import styled from "@emotion/styled";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../../src/actions";
import _Table from "../../../src/components/Table";
import { LOG_ACTION_LABEL } from "../../../src/constants";
import Button from "../../../src/elements/Button";
import Title from "../../../src/elements/Title";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import moment from "../../../src/libs/customMoment";

const Container = styled(Flex)`
  flex-grow: 1;
  margin: 0 1rem 1rem;
`;

export const Head = styled(Flex)`
  margin-bottom: 1rem;
`;

const Table = styled(_Table)`
  .rt-tr > .rt-th,
  .rt-tr > .rt-td {
    width: 15% !important;

    :first-of-type {
      width: 15% !important;
    }
    :last-of-type {
      width: 10% !important;
    }
  }
`;

const Danger = styled.span`
  color: red;
  font-weight: bold;
`;

// TODO Clean these columns.
/* eslint-disable react/display-name */
const COLUMNS = [
  {
    Cell: ({ value }) => (value !== null ? value.name : <Danger>Unknown</Danger>),
    Header: "Nom (ou email)",
    accessor: "user",
  },
  {
    Cell: ({ value }) => (value !== null ? value.role : <Danger>Unknown</Danger>),
    Header: "Role",
    accessor: "user",
  },
  {
    Header: "IP",
    accessor: "ip",
  },
  {
    Cell: ({ value }) => LOG_ACTION_LABEL[value],
    Header: "Action",
    accessor: "action",
  },
  {
    Header: "Path",
    accessor: "url",
  },
  {
    Cell: ({ value }) => moment(value).format("L HH:mm:ss"),
    Header: "Date",
    accessor: "created_at",
  },
];
/* eslint-enable react/display-name */

class AdminLogsIndexPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(actions.logs.load({ pageIndex: -1 }));
  }

  deleteOlderThanOneWeek() {
    this.props.dispatch(actions.logs.deleteOlderThanOneWeek());
  }

  render() {
    const { logs } = this.props;

    return (
      <AdminMainLayout>
        <Container flexDirection="column">
          <Head alignItems="flex-end" justifyContent="space-between">
            <Title>Logs</Title>
            <Button
              color="danger"
              onClick={this.deleteOlderThanOneWeek.bind(this)}
              title="Bouton effaçant l'ensemble de logs dépassant une semaine d'ancienneté"
            >
              Purger
            </Button>
          </Head>
          <Table
            columns={COLUMNS}
            data={logs.data}
            defaultSorted={[{ desc: true, id: "created_at" }]}
            filterable={true}
            multiSort={false}
            pageSize={10}
            resizable={false}
            showPageSizeOptions={false}
            showPagination={true}
          />
        </Container>
      </AdminMainLayout>
    );
  }
}

export default connect(({ logs }) => ({
  logs,
}))(AdminLogsIndexPage);
