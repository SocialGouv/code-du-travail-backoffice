import React from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";

const Container = styled.div`
  background-color: #606060;
  color: white;
  cursor: help;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.75;
  padding: 0.25rem 0.5rem;
  user-select: none;

  :hover {
    opacity: 1;
  }
`;

const Tooltip = styled(ReactTooltip)`
  padding: 0.25rem 0.5rem 0.45rem;
  width: 360px;
`;

export default ({ code, name }) => (
  <Container data-tip={name}>
    {code}
    <Tooltip />
  </Container>
);
