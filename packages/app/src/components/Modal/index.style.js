import styled from "@emotion/styled";
import { Flex } from "rebass";

export const Wrapper = styled(Flex)`
  background-color: rgba(249, 249, 252, 0.9);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
`;

export const Container = styled(Flex)`
  background-color: var(--color-mummy-tomb);
  border-radius: 0.25rem;
  color: white;
  flex-grow: 1;
  font-weight: 600;
  max-width: 640px;
  padding: 1rem;
  user-select: none;
`;
