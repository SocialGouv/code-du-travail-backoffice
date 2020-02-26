import styled from "@emotion/styled";
import React from "react";
import ReactTooltip from "react-tooltip";

const Container = styled.div`
  background-color: var(--color-label-background);
  border: solid 1px var(--color-border);
  border-radius: 0.25rem;
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
  max-width: 22rem;
  padding: 0.25rem 0.5rem 0.45rem;
  white-space: normal;
`;

const Idcc = ({ code, name, ...props }) => (
  <Container
    data-for={`idcc-${code}`}
    data-tip={code === undefined ? "Code du travail" : name}
    {...props}
  >
    {code === undefined ? "CDT" : `IDCC: ${code}`}
    <Tooltip id={`idcc-${code}`} />
  </Container>
);

export default Idcc;
