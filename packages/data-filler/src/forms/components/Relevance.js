import React from "react";
import styled from "styled-components";

import { Button } from "reactstrap";

const range = (min, max) => Array.from({ length: max - min }).fill(false);

const colors = [
  "hsla(1, 100%, 70%, 1)",
  "hsla(25, 100%, 70%, 1)",
  "hsla(50, 100%, 70%, 1)",
  "hsla(75, 100%, 70%, 1)",
  "hsla(99, 100%, 70%, 1)"
];

const StyledButton = styled(Button)`
  background: ${props => props.color};
  border: ${props =>
    props.selected ? "1px solid #333" : "1px solid transparent"};
  width: 30px;
  padding: 0;
  height: 30px;
  margin: 0 2px;
  color: black;
  &:hover {
    border: 1px solid #333;
  }
`;

const Relevance = ({ value, max = 5, onChange }) => (
  <div>
    {range(0, max).map((_, i) => (
      <StyledButton
        key={i}
        color={colors[i % colors.length]}
        selected={value - 1 === i}
        onClick={() => onChange(i + 1)}
      >
        {i + 1}
      </StyledButton>
    ))}
  </div>
);

export default Relevance;
