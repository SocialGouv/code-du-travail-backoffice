import React from "react";
import { Button as _Button } from "rebass";
import styled from "@emotion/styled";

import Icon from "./Icon";

const Button = styled(_Button)`
  background-color: ${p => (p.hasText ? p.color : "transparent")};
  border-radius: 0.125rem;
  color: ${p => (p.isLight ? "var(--color-eerie-black)" : "white")};
  cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
  display: flex;
  font-size: 0.9375rem;
  font-weight: 600;
  margin-right: ${p => (p.hasGroup ? "1rem" : 0)};
  min-height: 1.25rem;
  min-width: 1.25rem;
  opacity: ${p => (p.disabled ? 0.25 : 1)};
  padding: ${p => (p.isSmall ? "0.1rem 0.5rem 0.15rem" : "0.3rem 1rem 0.3rem")};
  white-space: nowrap;

  :hover {
    opacity: ${p => (p.disabled ? 0.25 : 1)};
  }

  svg {
    cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
    height: 1rem;
    margin-right: ${p => (p.hasText ? "0.25rem" : 0)};
    padding-top: ${p => (p.hasText ? "0.125rem" : 0)};
    width: 1rem;
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
  const isLight = COLOR[color].isLight;

  if (icon === undefined)
    return (
      <Button
        color={COLOR[color].value}
        disabled={disabled}
        hasGroup={hasGroup}
        hasText
        isLight={isLight}
        isSmall={isSmall}
        {...props}
      >
        {children}
      </Button>
    );

  const hasText = children !== undefined;

  if (hasText) {
    return (
      <Button
        color={COLOR[color].value}
        disabled={disabled}
        hasGroup={hasGroup}
        hasText
        isLight={isLight}
        isSmall={isSmall}
        {...props}
      >
        <Icon icon={icon} color={isLight ? "var(--color-eerie-black)" : "white"} />
        {children}
      </Button>
    );
  }

  return (
    <Button
      disabled={disabled}
      hasGroup={hasGroup}
      hasText={false}
      isLight={isLight}
      isSmall={isSmall}
      {...props}
    >
      <Icon icon={icon} color={COLOR[color].value} />
      {children}
    </Button>
  );
};
