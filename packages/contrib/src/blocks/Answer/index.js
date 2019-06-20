import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Idcc from "../../elements/Idcc";
import Link from "../../elements/Link";

import { ANSWER_STATE } from "../../constants";

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

export default ({ data, onCancel, onClick, onFallback }) => {
  const isTodo = data.state === ANSWER_STATE.TODO;
  const value = data.state === ANSWER_STATE.DRAFT ? data.prevalue : data.value;

  return (
    <Flex width={1}>
      <Content flexDirection="column" onClick={() => onClick(data.id)}>
        <Flex alignItems="baseline">
          <Idcc code={data.idcc} name={data.agreement} />
          <ContentQuestion>{`${data.index}) ${data.question}`}</ContentQuestion>
        </Flex>
        {!isTodo && data.generic_reference === null && (
          <ContentExtract>{value.substr(0, 100)}…</ContentExtract>
        )}
        {!isTodo && data.generic_reference === "labor_code" && (
          <ContentExtractRed>Renvoyé au Code du travail.</ContentExtractRed>
        )}
        {!isTodo && data.generic_reference === "national_agreement" && (
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
        {isTodo ? (
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
    </Flex>
  );
};
