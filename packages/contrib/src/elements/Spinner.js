import React from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => props.size};
  height: ${props => props.size};
`;

const ripple = keyframes`
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
`;
const Spinner = styled.div`
  position: absolute;
  border: 4px solid #666666;
  opacity: 1;
  border-radius: 50%;
  animation: ${ripple} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
`;
const SpinnerNext = styled(Spinner)`
  animation-delay: -0.5s;
`;

export default ({ size }) => (
  <Container size={size !== undefined ? size : "4rem"}>
    <Spinner />
    <SpinnerNext />
  </Container>
);
