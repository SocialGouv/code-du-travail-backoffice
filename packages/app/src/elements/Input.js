import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { omit } from "ramda";
import React from "react";

import Icon from "./Icon";

const InputWithIconWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  -webkit-appearance: none;
  background-color: white;
  border: solid 1px var(${p => (p.hasError ? "--color-text-red" : "--color-border")});
  color: inherit;
  flex-grow: 1;
  font-family: inherit;
  font-weight: inherit;
  font-size: 0.875rem;
  line-height: 1;
  opacity: ${p => (p.disabled ? 0.25 : 1)};
  padding: 0.6rem ${p => (p.hasIcon ? "2.25rem" : "0.6rem")} 0.625rem 0.6rem;
  width: 100%;

  ::placeholder {
    color: var(--color-placeholder);
  }

  :focus {
    box-shadow: 0 0 0 1px var(${p => (p.hasError ? "--color-text-red" : "--color-text-blue")}) !important;
  }
`;
const InputIcon = styled(Icon)`
  color: var(--color-placeholder);
  right: 0.8rem;
  top: 0.725rem;
  position: absolute;
`;

const Input = React.forwardRef(({ disabled = false, icon, hasError = false, ...props }, ref) => {
  if (icon === undefined) {
    return (
      <StyledInput disabled={disabled} hasError={hasError} hasIcon={false} ref={ref} {...props} />
    );
  }

  const { className, style } = props;
  const inputProps = omit(["className", "style"], props);

  return (
    <div className={className} style={style}>
      <InputWithIconWrapper>
        <InputIcon data-testid="icon" icon={icon} />
        <StyledInput
          data-testid="input"
          disabled={disabled}
          hasError={hasError}
          hasIcon
          ref={ref}
          {...inputProps}
        />
      </InputWithIconWrapper>
    </div>
  );
});

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  icon: PropTypes.string,
  style: PropTypes.object,
};

Input.displayName = "Input";

export default Input;
