import Head from "next/head";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import LoadingSpinner from "../elements/LoadingSpinner";
import Header from "./Header";
import Menu from "./Menu";

// TODO Find a clean way to import these stylesheets.
import quillSheet from "../../node_modules/quill/dist/quill.snow.css";
import reactTableSheet from "../../node_modules/react-table/react-table.css";
import mainSheet from "./css/main.css";
import mainSheetOverride from "./css/main-override.css";

const Container = styled(Flex)`
  height: 100vh;
`;

const Body = styled(Flex)`
  background-color: var(--color-background);
`;

const Content = styled(Flex)`
  flex-grow: 1;
  overflow: hidden;
`;

export default ({ children, isAdmin = false, isHorizontal, isLoading }) => (
  <Container alignItems="stretch" style={{ height: "100vh" }}>
    <Head>
      <title>Outil de contribution au code du travail numérique</title>
      <style jsx global>
        {mainSheet}
      </style>
      <style jsx global>
        {mainSheetOverride}
      </style>
      <style jsx global>
        {quillSheet}
      </style>
      <style jsx global>
        {reactTableSheet}
      </style>
    </Head>
    <Body alignItems="stretch" flexDirection="column" width={1}>
      <Header />
      {!isAdmin &&
        !isLoading &&
        !window.location.pathname.startsWith("/login") && <Menu />}
      {Boolean(isLoading) ? (
        <Content alignItems="center" justifyContent="center">
          <LoadingSpinner color="#666666" />
        </Content>
      ) : (
        <Content flexDirection={Boolean(isHorizontal) ? "row" : "column"}>
          {children}
        </Content>
      )}
    </Body>
  </Container>
);
