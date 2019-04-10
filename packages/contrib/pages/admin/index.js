import moment from "moment";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Subtitle from "../../src/elements/Subtitle";
import Title from "../../src/elements/Title";
import AdminMain from "../../src/layouts/AdminMain";
import customAxios from "../../src/libs/customAxios";

import "../../node_modules/react-table/react-table.css";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;
const HeadCell = styled.th`
  border-bottom: solid 1px lightgray;
  border-top: solid 1px lightgray;
  padding: 0.25rem 0.5rem;
  text-align: left;
`;
const Cell = styled.td`
  border-bottom: solid 1px lightgray;
  padding: 0.25rem 0.5rem;
  vertical-align: top;
  width: ${props => (props.width !== undefined ? `${props.width}px` : "auto")};
`;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastAnswers: []
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    const select =
      "select=id,question(value),agreement(idcc),updated_at,user(name)";
    const filter = "user_id=not.is.null&order=updated_at.desc&limit=10";

    try {
      const { data } = await this.axios.get(`/answers?${select}&${filter}`);
      this.setState({
        lastAnswers: data,
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  getAnswers() {
    return this.state.lastAnswers.map(answer => (
      <tr key={answer.id}>
        <Cell>{answer.agreement.idcc}</Cell>
        <Cell>{answer.question.value}</Cell>
        <Cell width="160">
          {moment(answer.updated_at).format("DD/MM/YY HH:mm")}
        </Cell>
        <Cell width="240">{answer.user.name}</Cell>
      </tr>
    ));
  }

  render() {
    return (
      <AdminMain>
        <Container flexDirection="column">
          <Title>Tableau de bord</Title>
          <Subtitle isFirst>Dernières réponses modifiées</Subtitle>
          <table>
            <thead>
              <tr>
                <HeadCell>IDCC</HeadCell>
                <HeadCell>Question</HeadCell>
                <HeadCell>Modifiée le</HeadCell>
                <HeadCell>Par</HeadCell>
              </tr>
            </thead>
            <tbody>{this.getAnswers()}</tbody>
          </table>
        </Container>
      </AdminMain>
    );
  }
}
