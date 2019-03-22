/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import moment from "moment";
import Router from "next/router";
import React from "react";
import ReactTable from "react-table";
import { Button as ReButton, Flex } from "rebass";
import styled from "styled-components";

import Title from "../elements/Title";
import AdminMain from "../layouts/AdminMain";
import customAxios from "../libs/customAxios";

import deleteImageUri from "../images/delete.svg";
import editImageUri from "../images/edit.svg";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;
const Button = styled(ReButton)`
  background-color: #2978a0;
  border-radius: 0;
  cursor: pointer;
  font-size: 0.825rem;
  height: auto;
  margin-bottom: 0.5rem;
  margin-left: 1rem;
`;
const Confirmation = styled.div`
  background-color: red;
  color: white;
  font-weight: 600;
  margin: 1rem 0;
  padding: 0.75rem 1rem;
`;
const ConfirmationButton = styled(ReButton)`
  background-color: ${props => (Boolean(props.isMain) ? "black" : "darkred")};
  border-radius: 0;
  cursor: pointer;
  font-size: 0.825rem;
  height: auto;
  margin: 1rem 0 0 1rem;
`;
const TableButton = styled.img`
  cursor: pointer;
  height: 1rem;
  width: 1rem;
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

    this.columns = [
      // {
      //   Header: "ID",
      //   accessor: "id",
      //   width: 136
      // },
      ...this.props.columns,
      {
        Header: "Créé le",
        accessor: data => moment(data.created_at).format("DD/MM/YY HH:mm"),
        filterable: false,
        id: "createdAt",
        style: { textAlign: "center" },
        width: 136
      },
      {
        Header: "Modifié le",
        accessor: data => moment(data.updated_at).format("DD/MM/YY HH:mm"),
        filterable: false,
        id: "updatedAt",
        style: { textAlign: "center" },
        width: 136
      },
      {
        // Header: "Catégorie",
        Cell: ({ value }) => (
          <TableButton
            alt=""
            onClick={() => this.edit(value)}
            src={editImageUri}
          />
        ),
        accessor: "id",
        filterable: false,
        headerStyle: { maxWidth: "2rem" },
        style: { textAlign: "center" },
        width: 40
      },
      {
        // Header: "Catégorie",
        Cell: ({ value }) => (
          <TableButton
            alt=""
            onClick={() => this.confirmDeletion(value)}
            src={deleteImageUri}
          />
        ),
        accessor: "id",
        filterable: false,
        style: { textAlign: "center" },
        width: 40
      }
    ];
  }

  async componentDidMount() {
    this.axios = customAxios();

    await this.fetchData();
  }

  async fetchData() {
    this.setState({ isFetching: true });

    try {
      const { data } = await this.axios.get(this.props.apiUri);
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
    Router.push(`${window.window.location.pathname}/new`);
  }

  edit(id) {
    Router.push(
      {
        pathname: window.location.pathname,
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
      await this.axios.delete(
        `${this.props.apiUri}?id=eq.${this.state.selectedId}`
      );
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

  // https://github.com/tannerlinsley/react-table/tree/v6#props
  customFilter(filter, row) {
    const id = filter.pivotId || filter.id;

    const filterValue = filter.value
      .replace(/(\W)/g, "\\$1")
      .replace("a", "[aáâàä]")
      .replace("e", "[eéêèë]")
      .replace("i", "[iíîìï]")
      .replace("o", "[oóôòö]")
      .replace("u", "[uúûùü]");

    return row[id] !== undefined
      ? new RegExp(filterValue, "i").test(String(row[id]))
      : true;
  }

  render() {
    if (this.state.isLoading) return <AdminMain isLoading />;

    return (
      <AdminMain>
        <Container flexDirection="column">
          <Flex alignItems="flex-end" justifyContent="space-between">
            <Title>{this.props.title}</Title>
            <Button onClick={this.new}>Nouveau</Button>
          </Flex>
          {this.state.confirmDeletion && (
            <Confirmation>
              <div>
                Êtes-vous sûr de vouloir supprimer {this.state.selectedId} ?
              </div>
              <Flex justifyContent="flex-end">
                <ConfirmationButton isMain onClick={() => this.delete()}>
                  OUI
                </ConfirmationButton>
                <ConfirmationButton onClick={() => this.cancelDeletion()}>
                  NON
                </ConfirmationButton>
              </Flex>
            </Confirmation>
          )}
          <ReactTable
            data={this.state.data}
            defaultFilterMethod={this.customFilter}
            defaultPageSize={10}
            columns={this.columns}
            filterable={true}
            resizable={false}
            showPageSizeOptions={false}
            sorted={[{ id: "updated_at", desc: true }]}
          />
        </Container>
      </AdminMain>
    );
  }
}
