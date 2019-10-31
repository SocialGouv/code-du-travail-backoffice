// https://loading.io/css/

import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
`;

const ripple = keyframes`
  0% {
    height: 0;
    left: 28px;
    opacity: 1;
    top: 28px;
    width: 0;
  }
  100% {
    height: 58px;
    left: -1px;
    opacity: 0;
    top: -1px;
    width: 58px;
  }
`;
const Spinner = styled.div`
  animation: ${ripple} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  border-radius: 50%;
  border: 4px solid ${p => p.color};
  opacity: 1;
  position: absolute;
`;
const SpinnerNext = styled(Spinner)`
  animation-delay: -0.5s;
`;

export default ({ color = "white", ...props }) => {
  return (
    <Container {...props}>
      <Spinner color={color} />
      <SpinnerNext color={color} />
    </Container>
  );
};
