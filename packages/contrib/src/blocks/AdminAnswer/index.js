import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import _Checkbox from "../../elements/Checkbox";
import Idcc from "../../elements/Idcc";
import excerpt from "../../helpers/excerpt";
import customMoment from "../../libs/customMoment";

const Container = styled(Flex)`
  margin-top: 1rem;
  user-select: none;
`;

const Checkbox = styled(_Checkbox)`
  margin-top: 1.75rem;
`;

const Top = styled(Flex)`
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`;
const TopState = styled.span`
  color: var(--color-shadow);
`;
const TopAuthor = styled.span`
  color: var(--color-blue-sapphire);
`;
const TopPublished = styled.span`
  background-color: var(--color-blue-sapphire);
  color: white;
  font-size: 0.625rem;
  opacity: ${({ disabled }) => (disabled ? 0.1 : 1)};
  padding: 0.125rem 0.25rem;
`;

const Content = styled(Flex)`
  background-color: white;
  border: solid 1px var(--color-border);
  border-radius: 0.4rem;
  cursor: pointer;
  flex-grow: 1;
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

import { ANSWER_STATE, ANSWER_STATE_LABEL } from "../../constants";

const AdminAnswerBlock = ({ data, isChecked, onCheck, onClick }) => {
  const {
    agreement_idcc,
    agreement_name,
    generic_reference,
    id,
    is_published,
    question_index,
    question_value,
    state,
    updated_at,
    user
  } = data;

  const isTodo = state === ANSWER_STATE.TO_DO;
  const value = [ANSWER_STATE.DRAFT, ANSWER_STATE.PENDING_REVIEW].includes(state)
    ? data.prevalue
    : data.value;

  return (
    <Container alignItems="center">
      {isChecked !== undefined && (
        <Checkbox icon={isChecked ? "check-square" : "square"} onClick={() => onCheck(id)} />
      )}
      <Flex flexDirection="column" width={1}>
        <Top justifyContent="space-between">
          <TopState>{ANSWER_STATE_LABEL[state]}</TopState>
          {![ANSWER_STATE.TO_DO, ANSWER_STATE.VALIDATED].includes(state) &&
            user !== undefined &&
            user !== null && (
              <TopAuthor>
                {state === ANSWER_STATE.DRAFT && `Rédigée par : ${user.name}`}
                {[ANSWER_STATE.PENDING_REVIEW, ANSWER_STATE.UNDER_REVIEW].includes(state) &&
                  `Proposée par : ${user.name}`}
                {state !== ANSWER_STATE.UNDER_REVIEW &&
                  `, ${customMoment(updated_at)
                    .tz("Europe/Paris")
                    .fromNow()}`}
              </TopAuthor>
            )}
          {state === ANSWER_STATE.VALIDATED && (
            <TopPublished disabled={!is_published}>Publiée</TopPublished>
          )}
        </Top>
        <Content flexDirection="column" onClick={() => onClick(id)}>
          <Flex alignItems="baseline">
            <Idcc code={agreement_idcc} name={agreement_name} />
            <ContentQuestion>{`${question_index}) ${question_value}`}</ContentQuestion>
          </Flex>
          {!isTodo && generic_reference === null && (
            <ContentExtract>{excerpt(value)}</ContentExtract>
          )}
          {!isTodo && generic_reference === "labor_code" && (
            <ContentExtractRed>Renvoyé au Code du travail.</ContentExtractRed>
          )}
          {!isTodo && generic_reference === "national_agreement" && (
            <ContentExtractRed>Renvoyé à la convention collective nationale.</ContentExtractRed>
          )}
        </Content>
      </Flex>
    </Container>
  );
};

export default AdminAnswerBlock;
