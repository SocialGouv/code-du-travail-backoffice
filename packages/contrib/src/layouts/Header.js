import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

const marianne = require("./img/marianne.svg");

const Container = styled(Flex)`
  background-color: white;
  border-top: solid 0.3rem black;
  min-height: 6rem;
  padding: 1rem;
`;
const Brand = styled(Flex)`
  cursor: pointer;
  height: 3rem;
`;
const Logo = styled.img`
  height: 3rem;
  margin-right: 1rem;
`;
const Title = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
`;
const Subtitle = styled.span`
  color: #999999;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
`;

export default () => (
  <Container alignItems="center" justifyContent="space-between">
    <Brand alignItems="center" onClick={() => Router.push("/")}>
      <Logo src={marianne} alt="Code du travail numérique" />
      <Flex flexDirection="column">
        <Title>Code du travail numérique</Title>
        <Subtitle>Outil de contribution</Subtitle>
      </Flex>
    </Brand>
  </Container>
);
