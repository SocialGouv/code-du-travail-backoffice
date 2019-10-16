import React from "react";
import { Flex, Text } from "rebass";
import styled from "styled-components";

const Field = styled(Flex)`
  margin-bottom: 0.5rem;
`;
const Error = styled(Text)`
  color: red;
  font-size: 0.75rem;
  font-weight: 600;
  height: 1rem;
`;

export default ({ children, error = null, ...props }) => (
  <Field {...props}>
    {children}
    {error !== null && <Error>{error}</Error>}
  </Field>
);
