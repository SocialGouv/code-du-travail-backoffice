import styled from "@emotion/styled";
import React from "react";
import { Button as _Button } from "rebass";

import Icon from "./Icon";

const Container = styled(_Button)`
  background-color: ${p => p.backgroundColor};
  border-radius: 0.125rem;
  color: ${p => p.foregroundColor};
  cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
  display: flex;
  font-size: 0.9375rem;
  font-weight: 600;
  margin-right: ${p => (p.hasGroup ? "1rem" : 0)};
  min-height: 1.25rem;
  min-width: 1.25rem;
  opacity: ${p => (p.disabled ? 0.25 : 0.75)};
  padding: ${p => (p.isSmall ? "0.1rem 0.4rem 0.15rem" : "0.3rem 1rem 0.3rem")};
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
  warning: { isLight: false, value: "var(--color-lapis-lazuli)" },
};

const Button = ({
  children,
  color = "primary",
  disabled = false,
  hasGroup = false,
  icon,
  isSmall = false,
  isTransparent = false,
  ...props
}) => {
  const hasText = children !== undefined;
  const isLight = COLOR[color].isLight;
  const backgroundColor = isTransparent ? "transparent" : COLOR[color].value;
  const foregroundColor = isTransparent
    ? COLOR[color].value
    : isLight
    ? "var(--color-eerie-black)"
    : "white";

  return (
    <Container
      backgroundColor={backgroundColor}
      disabled={disabled}
      foregroundColor={foregroundColor}
      hasGroup={hasGroup}
      hasText={hasText}
      isSmall={isSmall}
      {...props}
    >
      {icon !== undefined && <Icon color={foregroundColor} icon={icon} />}
      {children}
    </Container>
  );
};

export default Button;
