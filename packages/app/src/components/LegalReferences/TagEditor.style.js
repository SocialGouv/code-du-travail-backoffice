import styled from "@emotion/styled";

import Input from "../../elements/Input";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const ValueEditor = styled(Input)`
  border: 0;
`;
export const UrlEditor = styled(ValueEditor)`
  border-top: solid 1px var(--color-border);
`;
