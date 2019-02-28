import Head from "next/head";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Header from "./Header";

const Container = styled(Flex)`
  height: 100vh;
`;

const Body = styled(Flex)`
  background-color: #efeff0;
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
      <Header />
      <Content flexDirection={Boolean(isHorizontal) ? "row" : "column"}>
        {children}
      </Content>
    </Body>
  </Container>
);
