import { Flex } from "rebass";
import styled from "@emotion/styled";

export const Container = styled(Flex)`
  padding-top: 0.3rem;
`;

export const Dropdown = styled(Flex)`
  color: var(--color-dark-slate-gray);
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: 2.5rem;
  padding: 3px 0 0.5rem;
  position: relative;
  white-space: nowrap;

  :hover > div {
    display: flex;
  }

  > svg {
    width: 0.625rem !important;
  }
`;

export const DropdownText = styled.span`
  margin: 0.5rem 0.5rem 0.5rem 0;
`;

export const DropdownMenu = styled.div`
  background-color: white;
  box-shadow: 0 0 0.125rem lightgray;
  display: none;
  flex-direction: column;
  left: auto;
  margin-top: 2.5rem;
  position: absolute;
  right: 0;
  z-index: 1;
`;

export const DropdownLink = styled.a`
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  white-space: nowrap;

  :hover {
    background-color: var(--color-background);
    border-bottom: 0;
  }

  > svg {
    margin-right: 0.5rem;
    width: 0.625rem !important;
  }
`;
