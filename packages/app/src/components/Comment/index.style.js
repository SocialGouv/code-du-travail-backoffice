import styled from "@emotion/styled";
import { Flex } from "rebass";

const STRPED_BACKGROUND =
  "repeating-linear-gradient(45deg,#f4f4f4,#f4f4f4 10px,#ffffff 10px,#ffffff 20px)";

export const Container = styled(Flex)`
  margin: 0.35rem 0;
`;

export const Bubble = styled(Flex)`
  background: ${({ isPrivate }) => (!isPrivate ? "white" : STRPED_BACKGROUND)};
  border: 2px solid
    ${({ isPrivate }) => (isPrivate ? "var(--color-mummy-tomb)" : "var(--color-light-steel-blue)")};
  font-size: 0.75rem;
  margin: 0 1rem;
  padding: 0.5rem;
  position: relative;

  :before {
    border-bottom: 0.5rem solid transparent;
    border-top: 0.5rem solid
      ${({ isPrivate }) =>
        isPrivate ? "var(--color-mummy-tomb)" : "var(--color-light-steel-blue)"};
    content: "";
    height: 0px;
    position: absolute;
    top: 0.5rem;
    width: 0px;
  }

  :after {
    border-bottom: 0.5625rem solid transparent;
    border-top: 0.5625rem solid #fff;
    content: "";
    height: 0px;
    position: absolute;
    top: 0.625rem;
    width: 0px;
  }
`;

export const LeftBubble = styled(Bubble)`
  :before {
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid
      ${({ isPrivate }) =>
        isPrivate ? "var(--color-mummy-tomb)" : "var(--color-light-steel-blue)"};
    left: -1rem;
  }

  :after {
    border-left: 0.5625rem solid transparent;
    border-right: 0.5625rem solid #fff;
    left: -0.6875rem;
  }
`;

export const RightBubble = styled(Bubble)`
  flex-grow: 1;

  :before {
    border-left: 0.5rem solid
      ${({ isPrivate }) =>
        isPrivate ? "var(--color-mummy-tomb)" : "var(--color-light-steel-blue)"};
    border-right: 0.5rem solid transparent;
    right: -1rem;
  }

  :after {
    border-left: 0.5625rem solid #fff;
    border-right: 0.5625rem solid transparent;
    right: -0.6875rem;
  }
`;
