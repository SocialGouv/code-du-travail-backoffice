import PropTypes from "prop-types";
import React from "react";
import { Flex } from "rebass";

import LoadingSpinner from "../../elements/LoadingSpinner";
import AdminMenuWithRouter from "../AdminMenu";
import Main from "../Main";
import { Content } from "./styles";

const AdminMain = ({ children, hasBareContent = false, isLoading = false, noScroll = false }) => {
  if (isLoading || children === undefined) {
    return (
      <Main isHorizontal>
        <AdminMenuWithRouter />
        <Flex alignItems="center" flexGrow="1" justifyContent="center">
          <LoadingSpinner color="#666666" />
        </Flex>
      </Main>
    );
  }

  return (
    <Main isHorizontal>
      <AdminMenuWithRouter />
      {hasBareContent ? (
        children
      ) : (
        <Content data-testid="content" noScroll={noScroll}>
          {children}
        </Content>
      )}
    </Main>
  );
};

AdminMain.propTypes = {
  children: PropTypes.element,
  hasBareContent: PropTypes.bool,
  isLoading: PropTypes.bool,
  noScroll: PropTypes.bool,
};

export default AdminMain;
