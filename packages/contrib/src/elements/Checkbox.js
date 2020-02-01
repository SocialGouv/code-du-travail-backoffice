import React from "react";

import Button from "./Button";

const Checkbox = ({ color = "primary", isChecked = false, onClick, ...props }) => (
  <Button
    color={color}
    icon={isChecked ? "check-square" : "square"}
    onClick={onClick}
    role="checkbox"
    {...props}
  />
);

export default Checkbox;
