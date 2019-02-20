import axios from "axios";
import io from "socket.io-client";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Editor from "../src/components/editor";
import Main from "../src/layouts/main";

const Input = styled.input`
  background-color: #315659;
  border: 0;
  color: #ffffff;
  font-family: inherit;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 2;
  padding: 0 0.9rem;
`;

const Content = styled(Flex)`
  background-color: #c6e0ff;
`;
const SideBar = styled(Flex)`
  background-color: #253031;
`;

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  componentDidMount() {
    this.socket = io();

    axios
      .get(`http://localhost:3200/answers?id=eq.${this.props.id}`)
      .then(({ data }) => this.setState({ isLoading: false, ...data[0] }))
      .catch(console.warn);
  }

  saveContent(markdownSource) {
    this.socket.emit("saveAnswer", {
      id: this.props.id,
      value: markdownSource
    });
  }

  render() {
    if (this.state.isLoading) return <Main>Loading...</Main>;

    return (
      <Main>
        <Input defaultValue="Nouvelle question" />
        <Flex flexDirection="row" style={{ flexGrow: 1 }}>
          <Content p={3} width={3 / 5}>
            <Editor
              defaultValue={this.state.value}
              onChange={this.saveContent.bind(this)}
            />
          </Content>
          <SideBar width={2 / 5} />
        </Flex>
      </Main>
    );
  }
}
