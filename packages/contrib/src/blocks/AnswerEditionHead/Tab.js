import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import _Icon from "../../elements/Icon";

const Container = styled(Flex)`
  background-color: ${props => (props.isActive ? "white" : "lightgray")};
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  border-right: solid 1px gray;
  border-top: solid 1px gray;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
`;

const Icon = styled(_Icon)`
  margin-right: 0.5rem;
`;

export default ({ children, icon, isActive, onClick }) => (
  <Container alignItems="center" isActive={isActive} onClick={onClick}>
    <Icon icon={icon} isSmall />
    {children}
  </Container>
);
