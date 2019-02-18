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

export default class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.socket = io();
  }

  saveContent(markdownSource) {
    this.socket.emit("saveAnswer", {
      value: markdownSource
    });
  }

  render() {
    return (
      <Main>
        <Input defaultValue="Nouvelle question" />
        <Flex flexDirection="row" style={{ flexGrow: 1 }}>
          <Content p={3} width={3 / 5}>
            <Editor onChange={this.saveContent.bind(this)} />
          </Content>
          <SideBar width={2 / 5} />
        </Flex>
      </Main>
    );
  }
}
