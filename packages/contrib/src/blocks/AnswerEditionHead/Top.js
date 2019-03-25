import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Idcc from "../../elements/Idcc";

const Container = styled(Flex)`
  border-top: solid 1px #cbcbcb;
  min-height: 2rem;
  padding-left: 1rem;
`;
const Label = styled.span`
  color: #c2c2c2;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 1rem;
  user-select: none;
`;

export default ({ agreement, idcc }) => (
  <Container alignItems="flex-start" justifyContent="space-between">
    <Label>Brouillon</Label>
    <Idcc code={idcc} name={agreement} />
  </Container>
);
