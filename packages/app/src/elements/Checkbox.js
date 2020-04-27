import PropTypes from "prop-types";
import React from "react";

import Button from "./Button";

const Checkbox = ({ isChecked = false, ...props }) => (
  <Button icon={isChecked ? "check-square" : "square"} isTransparent role="checkbox" {...props} />
);

Checkbox.propTypes = {
  ...Button.propTypes,
  isChecked: PropTypes.bool.isRequired,
};

export default Checkbox;
