import styled from "@emotion/styled";
import { omit } from "ramda";
import React from "react";

import Icon from "./Icon";

const InputWithIconWrapper = styled.div`
  margin-top: -1.375rem;
`;

const _Input = styled.input`
  -webkit-appearance: none;
  background-color: white;
  border: solid 1px var(${p => (p.hasError ? "--color-text-red" : "--color-border")});
  color: inherit;
  flex-grow: 1;
  font-family: inherit;
  font-weight: inherit;
  font-size: 0.875rem;
  height: 2rem;
  line-height: 1;
  opacity: ${p => (p.disabled ? 0.25 : 1)};
  padding: 0.5rem 0.6rem 0.55rem ${p => (p.hasIcon ? "2rem" : "0.6rem")};
  width: 100%;

  ::placeholder {
    color: var(--color-placeholder);
  }
`;
const InputIcon = styled(Icon)`
  color: var(--color-placeholder);
  left: 0.625rem;
  top: 1.775rem;
  position: relative;
`;

const Input = ({ disabled = false, icon, hasError, ...props }, ref) => {
  if (icon === undefined) {
    return <_Input disabled={disabled} hasError={hasError} hasIcon={false} ref={ref} {...props} />;
  }

  const { className, style } = props;
  const inputProps = omit(["className", "style"], props);

  return (
    <div className={className} style={style}>
      <InputWithIconWrapper>
        <InputIcon icon={icon} />
        <_Input disabled={disabled} hasError={hasError} hasIcon ref={ref} {...inputProps} />
      </InputWithIconWrapper>
    </div>
  );
};

// https://reactjs.org/docs/forwarding-refs.html
export default React.forwardRef(Input);
