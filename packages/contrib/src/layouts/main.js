import Head from "next/head";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

const Body = styled(Flex)`
  background-color: #efeff0;
`;

export default ({ children }) => (
  <Flex alignItems="stretch" style={{ height: "100vh" }}>
    <Head>
      <title>Outil de contribution au code du travail numérique</title>
      <link rel="stylesheet" href="/static/temp.css" />
      <link rel="stylesheet" href="/static/main.css" />
    </Head>
    <Body alignItems="stretch" flexDirection="column" width={1}>
      {children}
    </Body>
  </Flex>
);
