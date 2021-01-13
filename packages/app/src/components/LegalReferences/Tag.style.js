import styled from "@emotion/styled";
import ReactTooltip from "react-tooltip";
import { Flex } from "rebass";

export const Container = styled(Flex)`
  background-color: ${p =>
    p.isEditing ? "transparent" : p.isLegacy ? "var(--color-text-red)" : "var(--color-alice-blue)"};
  border: solid 1px var(--color-border);
  cursor: ${p => (p.isEditing ? "auto" : "help")};
  font-size: 0.875rem;
  margin: 0.5rem 0.5rem 0 0;
  max-height: 2rem;
  max-width: 100%;
  min-height: 2rem;
  min-width: 100%;
  padding: ${p => (p.isEditing ? "0" : "0.25rem 0.5rem 0.275rem")};
  user-select: none;

  :hover {
    background-color: ${p =>
      p.isEditing ? "white" : p.isLegacy ? "var(--color-text-red)" : "var(--color-periwinkle)"};
  }
`;

export const Label = styled.div`
  color: var(--color-japenese-indigo);
  font-weight: 600;
  user-select: text;
`;

export const ButtonsContainer = styled.div`
  margin: 1px 0 0 0.5rem;
  white-space: nowrap;

  > button {
    margin-left: 0.5rem;
  }
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
  white-space: pre-wrap;
`;
