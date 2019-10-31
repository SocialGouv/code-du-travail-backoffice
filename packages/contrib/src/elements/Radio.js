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

export default ({ onChange, options, ...props }) => (
  <div role="radiogroup">
    {options.map(({ isSelected = false, label, value }, index) => (
      <div key={index}>
        <Icon
          aria-checked={String(isSelected)}
          aria-hidden="false"
          icon={`${isSelected ? "dot-" : ""}circle`}
          onClick={() => (isSelected ? void 0 : onChange(value))}
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
