import moment from "moment-timezone";
import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "@emotion/styled";

import Table from "../components/Table";
import Button from "../elements/Button";
import Title from "../elements/Title";
import AdminMain from "../layouts/AdminMain";
import customAxios from "../libs/customAxios";
import stringFrIncludes from "../libs/stringFrIncludes";
import unspace from "../libs/unspace";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;
const Head = styled(Flex)`
  margin-bottom: 1rem;
`;
const Confirmation = styled.div`
  background-color: var(--color-cadet-grey);
  color: white;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
`;

const PAGE_SIZE = 10;

export default class AdminIndex extends React.Component {
  constructor(props) {
    super(props);

    const { apiDeletePath, apiGetPath, apiPath, columns, sortedBy } = props;

    this.apiGetPath = apiGetPath !== undefined ? apiGetPath : apiPath;
    this.apiDeletePath = apiDeletePath !== undefined ? apiDeletePath : apiPath;

    this.columns = [...columns];

    if (!Boolean(this.props.noTimestamps)) {
      // this.columns.push({
      //   Header: "Créé le",
      //   accessor: data =>
      //     moment(data.created_at)
      //       .tz("Europe/Paris")
      //       .format("YYYY-MM-DD HH:mm"),
      //   filterable: false,
      //   id: "createdAt",
      //   style: { textAlign: "center" },
      //   width: 160
      // });

      this.columns.push({
        Header: "Modifié le",
        accessor: data =>
          moment(data.updated_at)
            .tz("Europe/Paris")
            .format("YYYY-MM-DD HH:mm"),
        filterable: false,
        id: "updatedAt",
        style: { textAlign: "center" },
        width: 160
      });
    }

    if (!Boolean(this.props.noEdit)) {
      this.columns.push({
        Cell: ({ value }) => (
          <Button
            icon="edit"
            isSmall
            onClick={() => this.edit(value)}
            title={unspace(this.props.ariaLabels.editButton)}
          />
        ),
        accessor: "id",
        filterable: false,
        headerStyle: { maxWidth: "2rem" },
        sortable: false,
        style: { textAlign: "center" },
        width: 40
      });
    }

    if (!Boolean(this.props.noDelete)) {
      this.columns.push({
        Cell: ({ value }) => (
          <Button
            icon="trash"
            isSmall
            onClick={() => this.confirmDeletion(value)}
            title={unspace(this.props.ariaLabels.removeButton)}
          />
        ),
        accessor: "id",
        filterable: false,
        sortable: false,
        style: { textAlign: "center" },
        width: 40
      });
    }

    this.sortedBy = sortedBy !== undefined ? { ...sortedBy } : { id: "updatedAt", desc: true };

    this.state = {
      confirmDeletion: false,
      data: [],
      isLoading: true,
      isFetching: false,
      selectedId: ""
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    await this.fetchData();
  }

  async fetchData() {
    this.setState({ isFetching: true });

    try {
      const uri = Boolean(this.props.noTimestamps)
        ? this.apiGetPath
        : `${this.apiGetPath}${this.apiGetPath.includes("?") ? "&" : "?"}order=updated_at.desc`;
      const { data } = await this.axios.get(uri);
      this.setState({
        data,
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }

    this.setState({ isFetching: false });
  }

  new() {
    Router.push(`${window.location.pathname}/new`);
  }

  edit(id) {
    Router.push(
      {
        pathname: `${window.location.pathname}/edit`,
        query: { id }
      },
      `${window.location.pathname}/${id}`
    );
  }

  confirmDeletion(id) {
    this.setState({
      confirmDeletion: true,
      selectedId: id
    });
  }

  cancelDeletion() {
    this.setState({
      confirmDeletion: false,
      selectedId: ""
    });
  }

  async delete() {
    this.setState({ isFetching: true });

    try {
      // If the `apiDeletePath` prop is defined, this means the deletion is done
      // via a PostgREST RPC function, which must be called via a POST:
      if (this.props.apiDeletePath !== undefined) {
        await this.axios.post(this.apiDeletePath, {
          id: this.state.selectedId
        });
      } else {
        await this.axios.delete(`${this.apiDeletePath}?id=eq.${this.state.selectedId}`);
      }
      await this.fetchData();
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }

    this.setState({
      confirmDeletion: false,
      isFetching: false,
      selectedId: ""
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
    const { confirmDeletion, data, isLoading, selectedId } = this.state;

    if (isLoading) return <AdminMain isLoading />;

    return (
      <AdminMain>
        <Container flexDirection="column">
          <Head alignItems="flex-end" justifyContent="space-between">
            <Title>{this.props.title}</Title>
            {!Boolean(this.props.noCreate) && (
              <Button onClick={this.new} title={unspace(this.props.ariaLabels.newButton)}>
                Nouveau
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
                  title={unspace(this.props.ariaLabels.deleteButton)}
                >
                  Supprimer
                </Button>
                <Button
                  color="secondary"
                  onClick={() => this.cancelDeletion()}
                  title={unspace(this.props.ariaLabels.cancelDeletionButton)}
                >
                  Annuler
                </Button>
              </Flex>
            </Confirmation>
          )}
          <Table
            data={data}
            defaultFilterMethod={this.customFilter}
            defaultPageSize={PAGE_SIZE}
            defaultSorted={[this.sortedBy]}
            columns={this.columns}
            filterable
            multiSort={false}
            resizable={false}
            showPagination={data.length > PAGE_SIZE}
            showPageSizeOptions={false}
          />
        </Container>
      </AdminMain>
    );
  }
}
