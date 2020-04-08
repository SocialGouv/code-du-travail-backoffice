import styled from "@emotion/styled";
import ReactTooltip from "react-tooltip";
import { Flex } from "rebass";

export const Container = styled(Flex)`
  background-color: var(--color-alice-blue);
  border: solid 1px var(--color-border);
  cursor: help;
  font-size: 0.875rem;
  margin: 0.5rem 0.5rem 0 0;
  max-width: 32rem;
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
  padding: 0.4rem 0.5rem 0;
`;

export const Button = styled.div`
  cursor: pointer;
  min-height: 100%;
  margin-left: 0.75rem;

  > img {
    height: 0.75rem;
    opacity: 0.5;
    vertical-align: 2px;
    width: 0.75rem;
  }

  :hover {
    > img {
      opacity: 1;
    }
  }
`;

export const Tooltip = styled(ReactTooltip)`
  background-color: white !important;
  border: solid 1px var(--color-border);
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
