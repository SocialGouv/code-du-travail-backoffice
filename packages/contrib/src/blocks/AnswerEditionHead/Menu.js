import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import bookImageUri from "../../images/book.svg";

const Container = styled(Flex)`
  margin-top: 0.5rem;
`;

const Tab = styled(Flex)`
  background-color: ${props => (props.isActive ? "white" : "lightgray")};
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  border-right: solid 1px gray;
  border-top: solid 1px gray;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
`;

const TabIcon = styled.img`
  height: 1rem;
  margin-right: 0.25rem;
  width: 1rem;
`;

export const TABS = {
  EDITOR: 0,
  REFERENCES: 1
};

export default ({ currentTab, onTabChange }) => (
  <Container>
    <Tab
      alignItems="center"
      isActive={currentTab === TABS.EDITOR}
      onClick={() => onTabChange(TABS.EDITOR)}
    >
      <TabIcon src={bookImageUri} />
      Édition du contenu
    </Tab>
    <Tab
      alignItems="center"
      isActive={currentTab === TABS.REFERENCES}
      onClick={() => onTabChange(TABS.REFERENCES)}
    >
      <TabIcon src={bookImageUri} />
      Références juridiques
    </Tab>
  </Container>
);
