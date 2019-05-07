import React from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";

const Container = styled.div`
  background-color: var(--color-label-background);
  border: solid 1px var(--color-black-leather-jacket);
  border-radius: 1rem;
  cursor: help;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 0.75rem;
  opacity: 0.75;
  padding: 0.25rem 0.5rem;
  user-select: none;
  white-space: nowrap;

  :hover {
    opacity: 1;
  }
`;

const Tooltip = styled(ReactTooltip)`
  padding: 0.25rem 0.5rem 0.45rem;
  width: 22rem;
  white-space: normal;
`;

export default ({ className, code, name, style }) => (
  <Container className={className} data-tip={name} style={style}>
    CCN: {code}
    <Tooltip />
  </Container>
);
