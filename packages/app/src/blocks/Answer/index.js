import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import { ANSWER_GENERIC_REFERENCE, ANSWER_STATE } from "../../constants";
import Idcc from "../../elements/Idcc";
import Link from "../../elements/Link";

const Content = styled(Flex)`
  background-color: white;
  border: solid 1px var(--color-border);
  border-radius: 0.4rem;
  cursor: pointer;
  flex-grow: 1;
  margin: 0.5rem 0;
  padding: 0.75rem 0.5rem 0.75rem 0.75rem;
  user-select: none;
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

const AnswerBlock = ({ data, onCancel, onClick, onFallback }) => {
  const isDraft = data.state === ANSWER_STATE.DRAFT;
  const isTodo = data.state === ANSWER_STATE.TO_DO;
  const value = isDraft ? data.prevalue : data.value;

  return (
    <Flex width={1}>
      <Content flexDirection="column" onClick={() => onClick(data.id)}>
        <Flex alignItems="baseline">
          {data.agreement !== null ? (
            <Idcc code={data.agreement_idcc} name={data.agreement_name} />
          ) : (
            <Idcc code="CDT" name="Code du travail" />
          )}
          <ContentQuestion>{`${data.question_index}) ${data.question_value}`}</ContentQuestion>
        </Flex>
        {!isTodo && data.generic_reference === null && (
          <ContentExtract>{value.substr(0, 100)}…</ContentExtract>
        )}
        {!isTodo && data.generic_reference === ANSWER_GENERIC_REFERENCE.LABOR_CODE && (
          <ContentExtractRed>Renvoyé au Code du travail.</ContentExtractRed>
        )}
        {!isTodo && data.generic_reference === ANSWER_GENERIC_REFERENCE.NATIONAL_AGREEMENT && (
          <ContentExtractRed>Renvoyé à la convention collective nationale.</ContentExtractRed>
        )}
      </Content>
      <Menu alignItems="start" flexDirection="column" justifyContent="space-evenly">
        {isTodo && [
          <Link
            disabled={data.generic_reference === ANSWER_GENERIC_REFERENCE.LABOR_CODE}
            isSmall
            key="0"
            onClick={() => onFallback(data.id, ANSWER_GENERIC_REFERENCE.LABOR_CODE)}
          >
            Renvoi au Code du travail
          </Link>,
          <Link
            disabled={data.generic_reference === ANSWER_GENERIC_REFERENCE.NATIONAL_AGREEMENT}
            isSmall
            key="1"
            onClick={() => onFallback(data.id, ANSWER_GENERIC_REFERENCE.NATIONAL_AGREEMENT)}
          >
            Renvoi à la CC nationale
          </Link>,
        ]}
        {isDraft && (
          <Link isSmall onClick={() => onCancel(data.id)}>
            Annuler ma réponse
          </Link>
        )}
      </Menu>
    </Flex>
  );
};

export default AnswerBlock;
