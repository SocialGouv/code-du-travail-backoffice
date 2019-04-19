import * as Icons from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button as _Button } from "rebass";
import styled from "styled-components";

const Button = styled(_Button)`
  background-color: ${({ color, hasText }) =>
    !hasText ? "transparent" : color};
  border-radius: 0;
  color: ${({ isLight }) => (isLight ? "var(--color-eerie-black)" : "white")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: flex;
  font-size: inherit;
  line-height: 1.5;
  margin-right: ${({ hasGroup }) => (hasGroup ? "1rem" : 0)};
  min-height: 1.25rem;
  min-width: 1.25rem;
  opacity: ${({ disabled }) => (disabled ? 0.25 : 0.75)};
  padding: ${({ isSmall }) =>
    isSmall ? "0.125rem 0.25rem" : "0.25rem 0.5rem"};
  white-space: nowrap;

  :hover {
    opacity: ${({ disabled }) => (disabled ? 0.25 : 1)};
  }
`;

const COLOR = {
  danger: { isLight: false, value: "var(--color-shadow)" },
  info: { isLight: false, value: "var(--color-misty-moss)" },
  primary: { isLight: false, value: "var(--color-lapis-lazuli)" },
  secondary: { isLight: true, value: "var(--color-periwinkle)" },
  warning: { isLight: false, value: "var(--color-lapis-lazuli)" }
};

export default ({
  children,
  color = "primary",
  disabled = false,
  hasGroup = false,
  icon,
  isSmall = false,
  ...props
}) => {
  if (icon === undefined)
    return (
      <Button
        color={COLOR[color].value}
        disabled={disabled}
        hasGroup={hasGroup}
        hasText
        isLight={COLOR[color].isLight}
        isSmall={isSmall}
        {...props}
      >
        {children}
      </Button>
    );

  // eslint-disable-next-line import/namespace
  library.add(Icons[`fa${icon[0].toUpperCase()}${icon.substr(1)}`]);
  const hasText = children !== undefined;

  return (
    <Button
      disabled={disabled}
      hasGroup={hasGroup}
      hasText={hasText}
      isLight={COLOR[color].isLight}
      isSmall={isSmall}
      {...props}
    >
      <FontAwesomeIcon
        icon={icon}
        color={COLOR[color].value}
        size={isSmall ? "sm" : "1x"}
      />
      {children}
    </Button>
  );
};
