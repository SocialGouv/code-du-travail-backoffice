// https://loading.io/css/

import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import React from "react";

const Container = styled.div`
  display: inline-block;
  height: ${p => p.size}px;
  position: relative;
  width: ${p => p.size}px;
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
  border: ${p => Math.round(p.size / 10)}px solid ${p => p.color};
  border-color: ${p => p.color} transparent transparent transparent;
  border-radius: 50%;
  box-sizing: border-box;
  display: block;
  height: ${p => Math.round((p.size * 4) / 5)}px;
  margin: ${p => Math.round(p.size / 10)}px;
  position: absolute;
  width: ${p => Math.round((p.size * 4) / 5)}px;
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

const SavingSpinner = ({ color = "white", size = 64, ...props }) => {
  return (
    <Container size={size} {...props}>
      <FirstSpinner color={color} data-testid="first-spinner" size={size} />
      <SecondSpinner color={color} data-testid="second-spinner" size={size} />
      <ThirdSpinner color={color} data-testid="third-spinner" size={size} />
      <Spinner color={color} data-testid="spinner" size={size} />
    </Container>
  );
};

SavingSpinner.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
};

export default SavingSpinner;
