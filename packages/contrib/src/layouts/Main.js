import Head from "next/head";
import { withRouter } from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import LoadingSpinner from "../elements/LoadingSpinner";
import Header from "./Header";

// TODO Find a clean way to import these stylesheets.
import quillSheet from "../../node_modules/quill/dist/quill.snow.css";
import mainSheet from "./css/main.css";
import mainSheetOverride from "./css/main-override.css";
import reactTableSheet from "../../node_modules/react-table/react-table.css";
// eslint-disable-next-line max-len
import reactToastifySheet from "../../node_modules/react-toastify/dist/ReactToastify.css";

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

const Main = ({
  children,
  isAdmin = false,
  isHorizontal = false,
  isLoading = false,
  router
}) => (
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
      <style jsx global>
        {reactToastifySheet}
      </style>
    </Head>
    <Body alignItems="stretch" flexDirection="column" width={1}>
      <Header
        hasContribMenu={!router.pathname.startsWith("/login")}
        isAdmin={isAdmin}
        router={router}
      />
      {isLoading ? (
        <Content alignItems="center" justifyContent="center">
          <LoadingSpinner color="#666666" />
        </Content>
      ) : (
        <Content flexDirection={isHorizontal ? "row" : "column"}>
          {children}
        </Content>
      )}
    </Body>
  </Container>
);

export default withRouter(Main);
