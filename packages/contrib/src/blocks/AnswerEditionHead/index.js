import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import BaseTitle from "../../elements/Title";
import Menu from "./Menu";
import Top from "./Top";

const Title = styled(BaseTitle)`
  padding: 0 1rem;
`;

export default ({ agreement, currentTab, idcc, onTabChange, title }) => (
  <Flex flexDirection="column">
    <Top agreement={agreement} idcc={idcc} />
    <Title isFirst>{title}</Title>
    <Menu currentTab={currentTab} onTabChange={onTabChange} />
  </Flex>
);
