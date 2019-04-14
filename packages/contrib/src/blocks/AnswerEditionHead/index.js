import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import _Title from "../../elements/Title";
import Actions from "./Actions";
import Tabs from "./Tabs";
import Top from "./Top";

const Title = styled(_Title)`
  padding: 0 1rem;
`;

export default ({
  agreement,
  currentTab,
  idcc,
  onCancel,
  onTabChange,
  title
}) => (
  <Flex flexDirection="column">
    <Top agreement={agreement} idcc={idcc} />
    <Title isFirst>{title}</Title>
    <Flex justifyContent="space-between">
      <Tabs currentTab={currentTab} onChange={onTabChange} />
      <Actions onCancel={onCancel} />
    </Flex>
  </Flex>
);
