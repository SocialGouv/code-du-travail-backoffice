import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Idcc from "../../elements/Idcc";
import Link from "../../elements/Link";

import { ANSWER_STATE, ANSWER_GENERIC_REFERENCE } from "../../constants";

const Content = styled(Flex)`
  background-color: white;
  border: solid 1px var(--color-border);
  border-radius: 0.4rem;
  cursor: ${({ isEditable }) => (isEditable ? "pointer" : "auto")};
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

export default ({ data, onCancel, onClick, onFallback }) => {
  const isDraft = data.state === ANSWER_STATE.DRAFT;
  const isTodo = data.state === ANSWER_STATE.TO_DO;
  const value = isDraft ? data.prevalue : data.value;

  const isEditable = isTodo || isDraft;
  const _onClick = () => (isEditable ? onClick(data.id) : void 0);

  return (
    <Flex width={1}>
      <Content
        flexDirection="column"
        isEditable={isEditable}
        onClick={_onClick}
      >
        <Flex alignItems="baseline">
          <Idcc code={data.idcc} name={data.agreement} />
          <ContentQuestion>{`${data.index}) ${data.question}`}</ContentQuestion>
        </Flex>
        {!isTodo && data.generic_reference === null && (
          <ContentExtract>{value.substr(0, 100)}…</ContentExtract>
        )}
        {!isTodo &&
          data.generic_reference === ANSWER_GENERIC_REFERENCE.LABOR_CODE && (
            <ContentExtractRed>Renvoyé au Code du travail.</ContentExtractRed>
          )}
        {!isTodo &&
          data.generic_reference ===
            ANSWER_GENERIC_REFERENCE.NATIONAL_AGREEMENT && (
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
        {isTodo && [
          <Link
            disabled={
              data.generic_reference === ANSWER_GENERIC_REFERENCE.LABOR_CODE
            }
            key="0"
            isSmall
            onClick={() =>
              onFallback(data.id, ANSWER_GENERIC_REFERENCE.LABOR_CODE)
            }
          >
            Renvoi au Code du travail
          </Link>,
          <Link
            disabled={
              data.generic_reference ===
              ANSWER_GENERIC_REFERENCE.NATIONAL_AGREEMENT
            }
            key="1"
            isSmall
            onClick={() =>
              onFallback(data.id, ANSWER_GENERIC_REFERENCE.NATIONAL_AGREEMENT)
            }
          >
            Renvoi à la CC nationale
          </Link>
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
