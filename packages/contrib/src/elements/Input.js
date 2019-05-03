import React from "react";
import styled from "styled-components";

import Icon from "./Icon";

const Input = styled.input`
  -webkit-appearance: none;
  background-color: transparent;
  border: solid 1px var(--color-border);
  color: inherit;
  flex-grow: 1;
  font-family: inherit;
  font-weight: inherit;
  font-size: 0.875rem;
  height: 2rem;
  line-height: 1;
  padding: 0.4rem 0.6rem 0.575rem
    ${({ hasIcon }) => (Boolean(hasIcon) ? "2rem" : "0.6rem")};
  width: 100%;

  ::placeholder {
    color: var(--color-placeholder);
  }
`;
const InputIconContainer = styled.span`
  margin-left: 0.625rem;
  margin-top: 0.75rem;
  position: absolute;
`;
const InputIcon = styled(Icon)`
  color: var(--color-placeholder);
`;

export default ({ icon, ...props }) => {
  if (icon === undefined) return <Input {...props} />;

  return (
    <div>
      <InputIconContainer>
        <InputIcon icon={icon} />
      </InputIconContainer>
      <Input hasIcon {...props} />
    </div>
  );
};
