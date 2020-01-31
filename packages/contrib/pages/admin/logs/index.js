import styled from "@emotion/styled";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../../src/actions";
import _Table from "../../../src/components/Table";
import { LOG_ACTION_LABEL } from "../../../src/constants";
import Input from "../../../src/elements/Input";
import Title from "../../../src/elements/Title";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import moment from "../../../src/libs/customMoment";

const Container = styled(Flex)`
  flex-grow: 1;
  margin: 0 1rem 1rem;
`;
const Table = styled(_Table)`
  font-size: 0.875rem;
  margin-top: 1rem;

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
    accessor: "user"
  },
  {
    Cell: ({ value }) => (value !== null ? value.role : <Danger>Unknown</Danger>),
    Header: "Role",
    accessor: "user"
  },
  {
    Header: "IP",
    accessor: "ip"
  },
  {
    Cell: ({ value }) => LOG_ACTION_LABEL[value],
    Header: "Action",
    accessor: "action"
  },
  {
    Header: "Path",
    accessor: "url"
  },
  {
    Cell: ({ value }) => moment(value).format("L HH:mm:ss"),
    Header: "Date",
    accessor: "created_at"
  }
];
/* eslint-enable react/display-name */

class AdminLogsIndexPage extends React.Component {
  get queryFilter() {
    return this.$queryFilter !== undefined && this.$queryFilter !== null
      ? this.$queryFilter.value
      : "";
  }

  componentDidMount() {
    this.props.dispatch(actions.logs.load({ pageIndex: -1 }));
  }

  setQueryFilter() {
    this.props.dispatch(actions.logs.load({ query: this.queryFilter }));
  }

  render() {
    const { logs } = this.props;

    return (
      <AdminMainLayout>
        <Container flexDirection="column">
          <Title>Logs</Title>
          <Input
            defaultValue={logs.query}
            icon="search"
            onChange={this.setQueryFilter.bind(this)}
            ref={node => (this.$queryFilter = node)}
          />
          <Table
            data={logs.data}
            columns={COLUMNS}
            defaultSorted={[{ desc: true, id: "created_at" }]}
            filterable={false}
            multiSort={false}
            pageSize={10}
            resizable={false}
            showPagination={true}
            showPageSizeOptions={false}
          />
        </Container>
      </AdminMainLayout>
    );
  }
}

export default connect(({ logs }) => ({
  logs
}))(AdminLogsIndexPage);
