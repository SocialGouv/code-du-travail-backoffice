import styled from "@emotion/styled";
import React from "react";

import { validateMandatoryNullableString } from "../props/validators";

const Container = styled.div`
  background-color: var(--color-label-background);
  border: solid 1px var(--color-border);
  border-radius: 0.25rem;
  cursor: help;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 0.75rem;
  max-width: 3rem;
  min-width: 3rem;
  opacity: 0.75;
  padding: 0.25rem 0;
  position: relative;
  text-align: center;
  user-select: none;
  width: 3rem;
  white-space: nowrap;

  > div {
    background-color: var(--color-eerie-black);
    border-radius: 0.25rem;
    box-shadow: 0 0 0.5rem var(--color-eerie-black);
    color: white;
    display: none;
    font-size: 0.8rem;
    font-weight: 600;
    left: -1px;
    padding: 0.35rem 0.6rem 0.4rem;
    position: absolute;
    text-align: left;
    bottom: 2rem;
    width: 22rem;
    white-space: normal;
    z-index: 2;
  }

  :hover {
    opacity: 1;

    > div {
      display: block;
    }
  }
`;

const Idcc = ({ code, name, ...props }) => (
  <Container {...props}>
    {code === null ? "CDT" : code}
    <div data-testid="tooltip">{name === null ? "Code du travail" : name}</div>
  </Container>
);

Idcc.propTypes = {
  code: validateMandatoryNullableString,
  name: validateMandatoryNullableString,
};

export default Idcc;
