// https://loading.io/css/

import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  display: inline-block;
  height: ${props => props.size}px;
  position: relative;
  width: ${props => props.size}px;
`;

const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const Spinner = styled.div`
  animation: ${rotation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border: ${props => Math.round(props.size / 10)}px solid ${props => props.color};
  border-color: ${props => props.color} transparent transparent transparent;
  border-radius: 50%;
  box-sizing: border-box;
  display: block;
  height: ${props => Math.round((props.size * 4) / 5)}px;
  margin: ${props => Math.round(props.size / 10)}px;
  position: absolute;
  width: ${props => Math.round((props.size * 4) / 5)}px;
`;
const FirstSpinner = styled(Spinner)`
  animation-delay: -0.45s;
`;
const SecondSpinner = styled(Spinner)`
  animation-delay: -0.3s;
`;
const ThirdSpinner = styled(Spinner)`
  animation-delay: -0.15s;
`;

export default ({ color, size }) => {
  const _color = color !== undefined ? color : "white";
  const _size = size !== undefined ? size : 64;

  return (
    <Container size={_size}>
      <FirstSpinner color={_color} size={_size} />
      <SecondSpinner color={_color} size={_size} />
      <ThirdSpinner color={_color} size={_size} />
      <Spinner color={_color} size={_size} />
    </Container>
  );
};
