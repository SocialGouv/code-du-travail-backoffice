import styled from "@emotion/styled";
import PropTypes from "prop-types";
import React from "react";
import { Button as _Button } from "rebass";

import Icon from "./Icon";

const Container = styled(_Button)`
  background-color: ${p => p.backgroundColor};
  border-radius: 0.125rem;
  color: ${p => p.foregroundColor};
  cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  line-height: ${p => (p.hasText ? 1.5 : 0)};
  margin-left: ${p => (p.withMarginLeft ? "1rem" : 0)};
  margin-right: ${p => (p.withMarginRight ? "1rem" : 0)};
  min-width: auto;
  opacity: ${p => (p.disabled ? 0.25 : 0.75)};
  padding: ${p => (p.hasText ? (p.isSmall ? "0.1rem 0.4rem 0.15rem" : "0.3rem 1rem 0.3rem") : 0)};
  white-space: nowrap;

  :hover {
    opacity: ${p => (p.disabled ? 0.25 : 1)};
  }

  svg {
    cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
    margin-right: ${p => (p.hasText ? "0.25rem" : 0)};
    padding-top: ${p => (p.hasText ? "0.125rem" : 0)};
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
  icon,
  isDisabled = false,
  isSmall = false,
  isTransparent = false,
  withMarginLeft = false,
  withMarginRight = false,
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
      disabled={isDisabled}
      foregroundColor={foregroundColor}
      hasText={hasText}
      isSmall={isSmall}
      withMarginLeft={withMarginLeft}
      withMarginRight={withMarginRight}
      {...props}
    >
      {icon !== undefined && <Icon color={foregroundColor} data-testid="icon" icon={icon} />}
      {children}
    </Container>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  icon: PropTypes.string,
  isDisabled: PropTypes.bool,
  isSmall: PropTypes.bool,
  isTransparent: PropTypes.bool,
  withMarginLeft: PropTypes.bool,
  withMarginRight: PropTypes.bool,
};

export default Button;
