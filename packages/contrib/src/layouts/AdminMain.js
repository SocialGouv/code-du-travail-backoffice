import React from "react";
import styled from "styled-components";

import AdminMenu from "./AdminMenu";
import Main from "./Main";

const Content = styled.div`
  flex-grow: 1;
  overflow-y: ${({ isScrollable }) => (isScrollable ? "scroll" : "hidden")};
`;

export default ({
  children,
  hasBareContent,
  isLoading,
  isScrollable = true
}) => (
  <Main isAdmin isHorizontal isLoading={isLoading}>
    <AdminMenu />
    {Boolean(hasBareContent) ? (
      children
    ) : (
      <Content isScrollable={isScrollable}>{children}</Content>
    )}
  </Main>
);
