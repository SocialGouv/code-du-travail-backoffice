import React from "react";
import styled from "styled-components";

import Button from "./Button";

const Checkbox = styled(Button)`
  margin-top: 1.25rem;
`;

export default ({
  color = "primary",
  isChecked = false,
  onClick,
  ...props
}) => (
  <Checkbox
    color={color}
    icon={isChecked ? "check-square" : "square"}
    onClick={onClick}
    role="checkbox"
    {...props}
  />
);
