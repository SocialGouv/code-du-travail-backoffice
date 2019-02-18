import Head from "next/head";
import React from "react";
import { Flex } from "rebass";

export default ({ children }) => (
  <Flex alignItems="stretch" style={{ height: "100vh" }}>
    <Head>
      <title>Outil de contribution au code du travail numérique</title>
      <link rel="stylesheet" href="/static/temp.css" />
      <link rel="stylesheet" href="/static/main.css" />
    </Head>
    <Flex alignItems="stretch" flexDirection="column" width={1}>
      {children}
    </Flex>
  </Flex>
);
