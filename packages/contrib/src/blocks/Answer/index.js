import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Button from "../../elements/Button";
import Idcc from "../../elements/Idcc";

const Container = styled(Flex)`
  /* flex-grow: 1; */
`;

const Content = styled(Flex)`
  background-color: white;
  border-radius: 0.4rem;
  cursor: pointer;
  flex-grow: 1;
  margin: 0.5rem 0;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
`;
const ContentLabel = styled.div`
  color: var(--color-silver-sand);
  font-size: 0.8rem;
  font-weight: 600;
`;
const ContentQuestion = styled.div`
  color: black;
  font-weight: 600;
`;
const ContentExtract = styled.div`
  color: var(--color-mummy-tomb);
  font-family: monospace;
  font-size: 0.875rem;
  font-style: italic;
  margin-top: 0.5rem;
`;

const Menu = styled(Flex)`
  font-size: 0.875rem;
  font-weight: 600;
  padding-left: 1rem;
  min-width: 13rem;
`;

export default ({ data, isDraft, onCancel, onClick, onFallback }) => (
  <Container width={1}>
    <Content flexDirection="column" onClick={() => onClick(data.id)}>
      <Flex justifyContent="space-between">
        <ContentLabel>{isDraft ? "Brouillon" : "À rédiger"}</ContentLabel>
        <Idcc code={data.idcc} name={data.agreement} />
      </Flex>
      <ContentQuestion>{data.question}</ContentQuestion>
      {isDraft && (
        <ContentExtract>
          {data.generic_reference === null && `${data.value.substr(0, 100)}...`}
          {data.generic_reference === "labor_code" && (
            <strong>Renvoyé au Code du travail.</strong>
          )}
          {data.generic_reference === "national_agreement" && (
            <strong>Renvoyé à la convention collective nationale.</strong>
          )}
        </ContentExtract>
      )}
    </Content>
    <Menu
      alignItems="start"
      justifyContent="space-evenly"
      flexDirection="column"
    >
      {!isDraft ? (
        [
          <Button
            disabled={data.generic_reference === "labor_code"}
            key="0"
            isSmall
            onClick={() => onFallback(data.id, "labor_code")}
          >
            Renvoi au Code du travail
          </Button>,
          <Button
            disabled={data.generic_reference === "national_agreement"}
            key="1"
            isSmall
            onClick={() => onFallback(data.id, "national_agreement")}
          >
            Renvoi à la CC nationale
          </Button>
        ]
      ) : (
        <Button isSmall onClick={() => onCancel(data.id)}>
          Annuler ma réponse
        </Button>
      )}
    </Menu>
  </Container>
);
