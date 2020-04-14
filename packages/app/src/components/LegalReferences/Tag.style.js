import styled from "@emotion/styled";
import ReactTooltip from "react-tooltip";
import { Flex } from "rebass";

export const Container = styled(Flex)`
  background-color: var(${({ isLegacy }) => (isLegacy ? "--color-pearl" : "--color-alice-blue")});
  border: solid 1px var(--color-border);
  cursor: help;
  font-size: 0.875rem;
  margin: 0.5rem 0.5rem 0 0;
  min-width: 34rem;
  max-width: 34rem;
  user-select: none;

  :hover {
    background-color: var(--color-periwinkle);
  }
`;

export const Label = styled.div`
  padding: 0.2rem 0.4rem;
`;

export const ButtonsContainer = styled(Flex)`
  min-width: auto;
  padding: 0.25rem 0 0;
`;

export const Tooltip = styled(ReactTooltip)`
  background-color: white !important;
  border: solid 1px var(--color-border);
  border-radius: 0;
  box-shadow: 0 0 0.25rem var(--color-border);
  max-height: 40%;
  min-width: 34rem;
  max-width: 34rem;
  opacity: 1 !important;
  overflow-y: auto;
  padding: 0.25rem 0.5rem 0.45rem;
  user-select: text;
  white-space: pre-wrap;
`;
