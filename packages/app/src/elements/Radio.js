/* eslint-disable max-len */

import styled from "@emotion/styled";
import PropTypes from "prop-types";
import React from "react";

import Icon from "./Icon";

const Bullet = styled(Icon)`
  color: var(--color-text-blue);
  cursor: ${({ selected }) => (!selected ? "pointer" : "auto")};
  margin-right: 0.5rem;

  :hover {
    color: ${({ selected }) =>
      !selected ? "var(--color-lapis-lazuli)" : "var(--color-text-blue)"};
  }
`;

const Radio = ({ onChange, options, ...props }) => (
  <div role="radiogroup">
    {options.map(({ isSelected = false, label, value }, index) => (
      <div key={index}>
        <Bullet
          aria-checked={String(isSelected)}
          aria-hidden="false"
          icon={`${isSelected ? "dot-" : ""}circle`}
          onClick={!isSelected ? () => onChange(value) : undefined}
          role="radio"
          selected={isSelected}
          tabIndex={index === 0 ? "0" : "-1"}
          {...props}
        />
        {label}
      </div>
    ))}
  </div>
);

Radio.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.exact({
      isSelected: PropTypes.bool,
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
};

export default Radio;
