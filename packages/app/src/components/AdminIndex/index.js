import moment from "moment-timezone";
import Router from "next/router";
import React from "react";
import { Flex } from "rebass";

import Table from "../../components/Table";
import Button from "../../elements/Button";
import Title from "../../elements/Title";
import AdminMainLayout from "../../layouts/AdminMain";
import customPostgrester from "../../libs/customPostgrester";
import stringFrIncludes from "../../libs/stringFrIncludes";
import T from "../../texts";
import { Confirmation, Container, Head } from "./styles";

const PAGE_SIZE = 10;

export default class AdminIndex extends React.Component {
  constructor(props) {
    super(props);
    const {
      columns,
      i18nIsFeminine = false,
      i18nSubject = "MISSING_SUBJECT",
      noDelete = false,
      noEdit = false,
      noTimestamps = false,
    } = props;

    this.columns = [...columns];

    if (!noTimestamps) {
      this.columns.push({
        Header: "Modifié le",
        accessor: data => moment(data.updated_at).tz("Europe/Paris").format("YYYY-MM-DD HH:mm"),
        filterable: false,
        id: "updatedAt",
        style: { textAlign: "center" },
        width: 160,
      });
    }

    if (!noEdit) {
      this.columns.push({
        Cell: ({ value }) => (
          <Button
            icon="edit"
            isSmall
            onClick={() => this.edit(value)}
            title={T.ADMIN_COMMON_BUTTON_EDIT_TITLE(i18nSubject, i18nIsFeminine)}
          />
        ),
        accessor: "id",
        filterable: false,
        headerStyle: { maxWidth: "2rem" },
        sortable: false,
        style: { textAlign: "center" },
        width: 40,
      });
    }

    if (!noDelete) {
      this.columns.push({
        Cell: ({ value }) => (
          <Button
            icon="trash"
            isSmall
            onClick={() => this.confirmDeletion(value)}
            title={T.ADMIN_COMMON_BUTTON_DELETE_TITLE(i18nSubject, i18nIsFeminine)}
          />
        ),
        accessor: "id",
        filterable: false,
        sortable: false,
        style: { textAlign: "center" },
        width: 40,
      });
    }

    this.state = {
      confirmDeletion: false,
      data: [],
      isFetching: false,
      isLoading: true,
      selectedId: "",
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async fetchData() {
    this.setState({ isFetching: true });
    const { apiPath, apiSelectors } = this.props;

    const request = customPostgrester().select("*");
    if (apiSelectors !== undefined) {
      this.apiSelectors.forEach(selector => request.select(selector));
    }
    if (!this.props.noTimestamps) request.orderBy("updated_at", true);

    const { data } = await request.get(apiPath);

    this.setState({
      data,
      isFetching: false,
      isLoading: false,
    });
  }

  new() {
    Router.push(`${window.location.pathname}/new`);
  }

  edit(id) {
    Router.push(
      {
        pathname: `${window.location.pathname}/edit`,
        query: { id },
      },
      `${window.location.pathname}/${id}`,
    );
  }

  confirmDeletion(id) {
    this.setState({
      confirmDeletion: true,
      selectedId: id,
    });
  }

  cancelDeletion() {
    this.setState({
      confirmDeletion: false,
      selectedId: "",
    });
  }

  async delete() {
    this.setState({ isFetching: true });
    const { apiPath } = this.props;
    const { selectedId: id } = this.state;

    await customPostgrester().eq("id", id).delete(apiPath);

    await this.fetchData();

    this.setState({
      confirmDeletion: false,
      isFetching: false,
      selectedId: "",
    });
  }

  /**
   * Replace the default filter by a custom French-aware one for string values.
   *
   * @see https://github.com/tannerlinsley/react-table/tree/v6#props
   */
  // It is impossible to unit-test this part since it's injected in
  // react-table and the generated filter inputs are not query-able.
  // This will eventually be checked whithin e2e tests.
  /* istanbul ignore next */
  customFilter(filter, row) {
    return typeof row[filter.id] === "string"
      ? stringFrIncludes(filter.value, row[filter.id])
      : true;
  }

  render() {
    const { i18nIsFeminine = false, i18nSubject = "MISSING_SUBJECT" } = this.props;
    const { confirmDeletion, data, isLoading, selectedId } = this.state;

    if (isLoading) return <AdminMainLayout isLoading />;

    return (
      <AdminMainLayout>
        <Container flexDirection="column">
          <Head alignItems="flex-end" justifyContent="space-between">
            <Title>{T.ADMIN_COMMON_INDEX_TITLE(i18nSubject)}</Title>
            {!this.props.noCreate && (
              <Button
                onClick={this.new}
                title={T.ADMIN_COMMON_BUTTON_NEW_TITLE(i18nSubject, i18nIsFeminine)}
              >
                {T.ADMIN_COMMON_BUTTON_NEW_LABEL(i18nSubject, i18nIsFeminine)}
              </Button>
            )}
          </Head>
          {confirmDeletion && (
            <Confirmation>
              <div>Êtes-vous sûr de vouloir supprimer {selectedId} ?</div>
              <Flex justifyContent="flex-end">
                <Button
                  color="danger"
                  hasGroup
                  onClick={() => this.delete()}
                  title={T.ADMIN_COMMON_BUTTON_CONFIRM_DELETION_TITLE(i18nSubject, i18nIsFeminine)}
                >
                  Supprimer
                </Button>
                <Button
                  color="secondary"
                  onClick={() => this.cancelDeletion()}
                  title={T.ADMIN_COMMON_BUTTON_CANCEL_DELETION_TITLE(i18nSubject, i18nIsFeminine)}
                >
                  Annuler
                </Button>
              </Flex>
            </Confirmation>
          )}
          <Table
            columns={this.columns}
            data={data}
            defaultFilterMethod={this.customFilter}
            defaultPageSize={PAGE_SIZE}
            defaultSorted={[{ desc: true, id: "updatedAt" }]}
            filterable
            multiSort={false}
            resizable={false}
            showPageSizeOptions={false}
            showPagination={data.length > PAGE_SIZE}
          />
        </Container>
      </AdminMainLayout>
    );
  }
}
