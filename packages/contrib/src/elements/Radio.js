/* eslint-disable max-len */

import React from "react";
import styled from "@emotion/styled";

import _Icon from "./Icon";

const Icon = styled(_Icon)`
  color: var(--color-text-blue);
  cursor: ${({ selected }) => (!selected ? "pointer" : "auto")};
  margin-right: 0.5rem;

  :hover {
    color: ${({ selected }) =>
      !selected ? "var(--color-lapis-lazuli)" : "var(--color-text-blue)"};
  }
`;

export default ({ onChange, options, ...props }) => {
  return options.map(({ isSelected, label, value }, index) => (
    <div key={index}>
      <Icon
        icon={`${isSelected ? "dot-" : ""}circle`}
        onClick={() => onChange(value)}
        selected={isSelected}
        {...props}
      />
      {label}
    </div>
  ));
};
