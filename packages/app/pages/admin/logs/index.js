import React from "react";
import { connect } from "react-redux";

import * as actions from "../../../src/actions";
import { Container, Head } from "../../../src/components/AdminIndex/styles";
import Button from "../../../src/elements/Button";
import Table from "../../../src/elements/Table";
import Title from "../../../src/elements/Title";
import capitalize from "../../../src/helpers/capitalize";
import humanizeLogAction from "../../../src/helpers/humanizeLogAction";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import moment from "../../../src/libs/customMoment";

// TODO Clean these columns.
/* eslint-disable react/display-name */
const COLUMNS = [
  {
    Cell: ({ value }) => (value !== null ? value.name : "N/A"),
    Header: "Nom",
    accessor: "user",
  },
  {
    Cell: ({ value }) => (value !== null ? capitalize(value.role) : "N/A"),
    Header: "Role",
    accessor: "user",
  },
  {
    Header: "IP",
    accessor: "ip",
  },
  {
    Cell: ({ original: { method, path } }) => humanizeLogAction(method, path),
    Header: "Action",
    accessor: "method",
  },
  {
    Header: "Chemin",
    accessor: "path",
  },
  {
    Cell: ({ value }) => (value !== null ? <code>{value}</code> : "N/A"),
    Header: "Corps",
    accessor: "body",
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
            data={logs.list}
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
