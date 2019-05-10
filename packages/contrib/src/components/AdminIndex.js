import moment from "moment-timezone";
import Router from "next/router";
import React from "react";
import ReactTable from "react-table";
import { Flex } from "rebass";
import styled from "styled-components";

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

export default class AdminIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDeletion: false,
      data: [],
      isLoading: true,
      isFetching: false,
      selectedId: ""
    };

    this.apiGetPath =
      props.apiGetPath !== undefined ? props.apiGetPath : props.apiPath;
    this.apiDeletePath =
      props.apiDeletePath !== undefined ? props.apiDeletePath : props.apiPath;

    this.columns = [...this.props.columns];

    if (!Boolean(this.props.noTimestamps)) {
      this.columns.push({
        Header: "Créé le",
        accessor: data =>
          moment(data.created_at)
            .tz("Europe/Paris")
            .format("YYYY-MM-DD HH:mm"),
        filterable: false,
        id: "createdAt",
        style: { textAlign: "center" },
        width: 160
      });

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
        style: { textAlign: "center" },
        width: 40
      });
    }
  }

  async componentDidMount() {
    this.axios = customAxios();

    await this.fetchData();
  }

  async fetchData() {
    this.setState({ isFetching: true });

    try {
      const uri = `${this.apiGetPath}?order=updated_at.desc`;
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
        await this.axios.delete(
          `${this.apiDeletePath}?id=eq.${this.state.selectedId}`
        );
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
    if (this.state.isLoading) return <AdminMain isLoading />;

    return (
      <AdminMain>
        <Container flexDirection="column">
          <Head alignItems="flex-end" justifyContent="space-between">
            <Title>{this.props.title}</Title>
            {!Boolean(this.props.noCreate) && (
              <Button
                onClick={this.new}
                title={unspace(this.props.ariaLabels.newButton)}
              >
                Nouveau
              </Button>
            )}
          </Head>
          {this.state.confirmDeletion && (
            <Confirmation>
              <div>
                Êtes-vous sûr de vouloir supprimer {this.state.selectedId} ?
              </div>
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
          <ReactTable
            data={this.state.data}
            defaultFilterMethod={this.customFilter}
            defaultPageSize={10}
            defaultSorted={[{ id: "updated_at", desc: false }]}
            columns={this.columns}
            filterable={true}
            multiSort={false}
            resizable={false}
            showPageSizeOptions={false}
          />
        </Container>
      </AdminMain>
    );
  }
}
