import Head from "next/head";
import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

const marianne = require("./img/marianne.svg");

const Container = styled(Flex)`
  height: 100vh;
`;

const Body = styled(Flex)`
  background-color: #efeff0;
`;

const Header = styled(Flex)`
  background-color: white;
  border-top: solid 0.3rem black;
  min-height: 6rem;
  padding: 1rem;
`;
const Brand = styled(Flex)`
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 600;
  height: 3rem;
`;
const Logo = styled.img`
  height: 3rem;
  margin-right: 1rem;
`;

const Content = styled(Flex)`
  flex-grow: 1;
`;

export default ({ children, isHorizontal }) => (
  <Container alignItems="stretch" style={{ height: "100vh" }}>
    <Head>
      <title>Outil de contribution au code du travail numérique</title>
      <link rel="stylesheet" href="/static/temp.css" />
      <link rel="stylesheet" href="/static/main.css" />
    </Head>
    <Body alignItems="stretch" flexDirection="column" width={1}>
      <Header alignItems="center" justifyContent="space-between">
        <Brand alignItems="center" onClick={() => Router.push("/")}>
          <Logo src={marianne} alt="Code du travail numérique" />
          Code du travail numérique
        </Brand>
      </Header>
      <Content flexDirection={Boolean(isHorizontal) ? "row" : "column"}>
        {children}
      </Content>
    </Body>
  </Container>
);
