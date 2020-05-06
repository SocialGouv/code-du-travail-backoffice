import PropTypes from "prop-types";
import React from "react";
import { Flex } from "rebass";

import LoadingSpinner from "../../elements/LoadingSpinner";
import AdminMenu from "../AdminMenu";
import Main from "../Main";
import { Content } from "./styles";

const AdminMainLayout = ({
  children,
  hasBareContent = false,
  isLoading = false,
  isScrollable = true,
}) => {
  if (isLoading) {
    return (
      <Main isHorizontal>
        <AdminMenu />
        <Flex alignItems="center" flexGrow="1" justifyContent="center">
          <LoadingSpinner color="#666666" />
        </Flex>
      </Main>
    );
  }

  return (
    <Main isHorizontal>
      <AdminMenu />
      {hasBareContent ? children : <Content isScrollable={isScrollable}>{children}</Content>}
    </Main>
  );
};

AdminMainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  hasBareContent: PropTypes.bool,
  isLoading: PropTypes.bool,
  isScrollable: PropTypes.bool,
};

export default AdminMainLayout;
