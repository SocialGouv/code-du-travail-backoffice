import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Idcc from "../../elements/Idcc";
import Link from "../../elements/Link";

const Container = styled(Flex)`
  /* flex-grow: 1; */
`;

const Content = styled(Flex)`
  background-color: white;
  border: solid 1px var(--color-border);
  border-radius: 0.4rem;
  cursor: pointer;
  flex-grow: 1;
  margin: 0.5rem 0;
  padding: 0.75rem 0.5rem 0.75rem 0.75rem;
`;
const ContentQuestion = styled.div`
  color: black;
  font-weight: 600;
`;
const ContentExtract = styled.div`
  color: var(--color-text-gray);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;
const ContentExtractRed = styled(ContentExtract)`
  color: var(--color-text-red);
  font-weight: 700;
`;

const Menu = styled(Flex)`
  font-weight: 600;
  padding-left: 1.5rem;
  min-width: 13rem;
`;

export default ({ data, isDraft, onCancel, onClick, onFallback }) => (
  <Container width={1}>
    <Content flexDirection="column" onClick={() => onClick(data.id)}>
      <Flex alignItems="baseline">
        <Idcc code={data.idcc} name={data.agreement} />
        <ContentQuestion>{data.question}</ContentQuestion>
      </Flex>
      {isDraft && data.generic_reference === null && (
        <ContentExtract>{data.value.substr(0, 100)}…</ContentExtract>
      )}
      {isDraft && data.generic_reference === "labor_code" && (
        <ContentExtractRed>Renvoyé au Code du travail.</ContentExtractRed>
      )}
      {isDraft && data.generic_reference === "national_agreement" && (
        <ContentExtractRed>
          Renvoyé à la convention collective nationale.
        </ContentExtractRed>
      )}
    </Content>
    <Menu
      alignItems="start"
      justifyContent="space-evenly"
      flexDirection="column"
    >
      {!isDraft ? (
        [
          <Link
            disabled={data.generic_reference === "labor_code"}
            key="0"
            isSmall
            onClick={() => onFallback(data.id, "labor_code")}
          >
            Renvoi au Code du travail
          </Link>,
          <Link
            disabled={data.generic_reference === "national_agreement"}
            key="1"
            isSmall
            onClick={() => onFallback(data.id, "national_agreement")}
          >
            Renvoi à la CC nationale
          </Link>
        ]
      ) : (
        <Link isSmall onClick={() => onCancel(data.id)}>
          Annuler ma réponse
        </Link>
      )}
    </Menu>
  </Container>
);
