import Head from "next/head";
import { withRouter } from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Header from "./Header";
import Modal from "../components/Modal";
import LoadingSpinner from "../elements/LoadingSpinner";

// TODO Find a clean way to import these stylesheets.
import "../../node_modules/quill/dist/quill.snow.css";
import "../../node_modules/react-table/react-table.css";
import "../../node_modules/react-toastify/dist/ReactToastify.css";
import "../../node_modules/simplemde/dist/simplemde.min.css";
import "./css/main.css";
import "./css/main-override.css";

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
  router,
  ...props
}) => (
  <Container alignItems="stretch" style={{ height: "100vh" }}>
    <Head>
      <title>Outil de contribution au code du travail numérique</title>
    </Head>
    <Body alignItems="stretch" flexDirection="column" width={1}>
      <Modal />
      <Header
        hasContribMenu={!router.pathname.startsWith("/login")}
        isAdmin={isAdmin}
        router={router}
      />
      {isLoading ? (
        <Content alignItems="center" justifyContent="center" {...props}>
          <LoadingSpinner color="#666666" />
        </Content>
      ) : (
        <Content flexDirection={isHorizontal ? "row" : "column"} {...props}>
          {children}
        </Content>
      )}
    </Body>
  </Container>
);

export default withRouter(Main);
