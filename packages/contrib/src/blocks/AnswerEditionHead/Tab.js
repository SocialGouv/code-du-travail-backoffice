import React from "react";
import { Flex } from "rebass";
import styled from "@emotion/styled";

const Container = styled(Flex)`
  border-bottom: ${props => (props.isActive ? "solid 0.25rem var(--color-blue-sapphire)" : 0)};
  color: ${props =>
    props.isActive ? "var(--color-lapis-lazuli)" : "var(--color-black-leather-jacket)"};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: ${props => (props.isActive ? 600 : 400)};
  padding: 0.5rem 0;
  width: 12rem;
`;

export default ({ children, isActive, onClick }) => (
  <Container alignItems="center" isActive={isActive} justifyContent="center" onClick={onClick}>
    {children}
  </Container>
);
