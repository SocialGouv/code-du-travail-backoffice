import PropTypes from "prop-types";
import React from "react";
import { Flex } from "rebass";

import { ANSWER_STATE, ANSWER_STATE_LABEL } from "../../constants";
import Checkbox from "../../elements/Checkbox";
import Idcc from "../../elements/Idcc";
import excerpt from "../../helpers/excerpt";
import customMoment from "../../libs/customMoment";
import FullAnswerProps from "../../props/FullAnswer";
import { Container, Content, Extract, Question, State, Top, UpdatedAt } from "./index.style";

const Answer = ({ data, isChecked, onCheck, onClick }) => {
  const {
    agreement_idcc,
    agreement_name,
    generic_reference,
    id,
    question_index,
    question_value,
    state,
    updated_at,
  } = data;

  const value = [ANSWER_STATE.DRAFT, ANSWER_STATE.PENDING_REVIEW].includes(state)
    ? data.prevalue
    : data.value;

  if (state === ANSWER_STATE.TO_DO) {
    return (
      <Container flexDirection="column">
        <Top justifyContent="space-between">
          <State data-testid="state">{ANSWER_STATE_LABEL[state]}</State>
        </Top>
        <Flex>
          <Checkbox
            data-testid="checkbox"
            isChecked={isChecked}
            onClick={() => onCheck(id)}
            withMarginLeft
            withMarginRight
          />
          <Content data-testid="content" flexDirection="column" onClick={() => onClick(id)}>
            <Flex alignItems="baseline">
              <Idcc code={agreement_idcc} data-testid="idcc" name={agreement_name} />
              <Question data-testid="question">{`${question_index}) ${question_value}`}</Question>
            </Flex>
          </Content>
        </Flex>
      </Container>
    );
  }

  return (
    <Container flexDirection="column">
      <Top justifyContent="space-between">
        <State data-testid="state">{ANSWER_STATE_LABEL[state]}</State>
        <UpdatedAt data-testid="updated-at">{`Modifiée ${customMoment(updated_at)
          .tz("Europe/Paris")
          .calendar()}`}</UpdatedAt>
      </Top>
      <Flex>
        <Checkbox
          data-testid="checkbox"
          isChecked={isChecked}
          onClick={() => onCheck(id)}
          withMarginLeft
          withMarginRight
        />
        <Content data-testid="content" flexDirection="column" onClick={() => onClick(id)}>
          <Flex alignItems="baseline">
            <Idcc code={agreement_idcc} data-testid="idcc" name={agreement_name} />
            <Question data-testid="question">{`${question_index}) ${question_value}`}</Question>
          </Flex>
          {generic_reference === null && <Extract data-testid="extract">{excerpt(value)}</Extract>}
          {generic_reference === "labor_code" && (
            <Extract data-testid="extract" isGeneric>
              Renvoyé au Code du travail.
            </Extract>
          )}
          {generic_reference === "national_agreement" && (
            <Extract data-testid="extract" isGeneric>
              Renvoyé à la convention collective nationale.
            </Extract>
          )}
        </Content>
      </Flex>
    </Container>
  );
};

Answer.propTypes = {
  data: PropTypes.shape(FullAnswerProps),
  isChecked: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Answer;
