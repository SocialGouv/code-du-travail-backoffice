import React from "react";
import styled from "styled-components";

const Bubble = styled.div`
  border: 2px solid #00bfb6;
  font-size: 0.75rem;
  margin: 0.35rem 1rem;
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

export default ({ isMe = false, value }) =>
  isMe ? <RightBubble>{value}</RightBubble> : <LeftBubble>{value}</LeftBubble>;
