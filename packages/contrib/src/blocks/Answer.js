import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Idcc from "../elements/Idcc";

const Container = styled.div`
  background-color: white;
  border-radius: 0.4rem;
  cursor: pointer;
  margin: 1rem 1rem 0;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
`;

const Label = styled.div`
  color: #c2c2c2;
  font-size: 0.8rem;
  font-weight: 600;
`;

export default ({ data, label, onClick }) => (
  <Container onClick={onClick}>
    <Flex justifyContent="space-between">
      <Label>{label}</Label>
      <Idcc code={data.idcc} name={data.agreement} />
    </Flex>
    {data.question}
  </Container>
);
