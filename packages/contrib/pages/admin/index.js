import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import AdminAnswer from "../../src/blocks/AdminAnswer";
import Subtitle from "../../src/elements/Subtitle";
import Title from "../../src/elements/Title";
import AdminMain from "../../src/layouts/AdminMain";
import customAxios from "../../src/libs/customAxios";

import "../../node_modules/react-table/react-table.css";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
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
      "select=*,question(index,value),agreement(idcc,name),user(name)";
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

  render() {
    return (
      <AdminMain>
        <Container flexDirection="column">
          <Title>Tableau de bord</Title>
          <Subtitle isFirst>Dernières réponses modifiées</Subtitle>
          {this.state.lastAnswers.map((answer, index) => (
            <AdminAnswer data={answer} key={index} />
          ))}
        </Container>
      </AdminMain>
    );
  }
}
