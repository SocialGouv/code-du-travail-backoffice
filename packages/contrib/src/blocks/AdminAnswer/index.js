import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Idcc from "../../elements/Idcc";
import Checkbox from "../../elements/Checkbox";
import excerpt from "../../helpers/excerpt";
import customMoment from "../../libs/customMoment";

const Container = styled(Flex)`
  margin-top: 1rem;
  user-select: none;
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

export default ({ data, isChecked, onCheck, onClick }) => {
  const isTodo = data.state === ANSWER_STATE.TO_DO;
  const value = [ANSWER_STATE.DRAFT, ANSWER_STATE.PENDING_REVIEW].includes(
    data.state
  )
    ? data.prevalue
    : data.value;

  return (
    <Container>
      {isChecked !== undefined && (
        <Checkbox
          icon={isChecked ? "check-square" : "square"}
          onClick={() => onCheck(data.id)}
        />
      )}
      <Flex flexDirection="column" width={1}>
        <Top justifyContent="space-between">
          <TopState>{ANSWER_STATE_LABEL[data.state]}</TopState>
          {data.user !== null && (
            <TopAuthor>
              {`Proposé par : ${data.user.name}, ${customMoment(data.updated_at)
                .tz("Europe/Paris")
                .fromNow()}`}
            </TopAuthor>
          )}
        </Top>
        <Content flexDirection="column" onClick={() => onClick(data.id)}>
          <Flex alignItems="baseline">
            <Idcc code={data.agreement_idcc} name={data.agreement_name} />
            <ContentQuestion>
              {`${data.question_index}) ${data.question_value}`}
            </ContentQuestion>
          </Flex>
          {!isTodo && data.generic_reference === null && (
            <ContentExtract>{excerpt(value)}</ContentExtract>
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
      </Flex>
    </Container>
  );
};
