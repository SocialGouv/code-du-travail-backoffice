import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import _Icon from "../elements/Icon";

const Container = styled(Flex)`
  margin: 0.35rem 0;
`;
const Icon = styled(_Icon)`
  cursor: pointer;
  opacity: 0.5;

  :hover {
    opacity: 1;
  }
`;
const Bubble = styled(Flex)`
  border: 2px solid #00bfb6;
  font-size: 0.75rem;
  margin: 0 1rem;
  padding: 0.5rem;
  position: relative;

  :before {
    border-bottom: 0.5rem solid transparent;
    border-top: 0.5rem solid #00bfb6;
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

const LeftBubble = styled(Bubble)`
  :before {
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid #00bfb6;
    left: -1rem;
  }

  :after {
    border-left: 0.5625rem solid transparent;
    border-right: 0.5625rem solid #fff;
    left: -0.6875rem;
  }
`;

const RightBubble = styled(Bubble)`
  flex-grow: 1;

  :before {
    border-left: 0.5rem solid #00bfb6;
    border-right: 0.5rem solid transparent;
    right: -1rem;
  }

  :after {
    border-left: 0.5625rem solid #fff;
    border-right: 0.5625rem solid transparent;
    right: -0.6875rem;
  }
`;

export default ({ isMe = false, onRemove, value }) => {
  if (isMe)
    return (
      <Container alignItems="center">
        <Icon color="var(--color-text-red)" icon="trash" onClick={onRemove} />
        <RightBubble>{value}</RightBubble>
      </Container>
    );

  return (
    <Container>
      <LeftBubble>{value}</LeftBubble>
    </Container>
  );
};
