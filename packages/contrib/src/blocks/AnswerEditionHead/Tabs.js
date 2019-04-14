import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Tab from "./Tab";

const Container = styled(Flex)`
  margin-top: 0.5rem;
`;

export const TABS = {
  EDITOR: 0,
  REFERENCES: 1
};

export default ({ currentTab, onChange }) => (
  <Container>
    <Tab
      icon="pen"
      isActive={currentTab === TABS.EDITOR}
      onClick={() => onChange(TABS.EDITOR)}
    >
      Édition du contenu
    </Tab>
    <Tab
      icon="book"
      isActive={currentTab === TABS.REFERENCES}
      onClick={() => onChange(TABS.REFERENCES)}
    >
      Références juridiques
    </Tab>
  </Container>
);
