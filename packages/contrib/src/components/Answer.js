import React from "react";
import ReactTooltip from "react-tooltip";
import { Flex } from "rebass";
import styled from "styled-components";

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
const Reference = styled.div`
  background-color: #606060;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.75;
  padding: 0.25rem 0.5rem;

  :hover {
    opacity: 1;
  }
`;
const Tooltip = styled(ReactTooltip)`
  padding: 0.25rem 0.5rem 0.45rem;
  width: 360px;
`;

export default ({ data, label, onClick }) => (
  <Container key={data.id} onClick={onClick}>
    <Flex justifyContent="space-between">
      <Label>{label}</Label>
      <Reference data-tip={data.labor_agreement.name}>
        {data.labor_agreement.idcc}
      </Reference>
      <Tooltip />
    </Flex>
    {data.question.value}
  </Container>
);
