import PropTypes from "prop-types";
import React from "react";
import { Flex } from "rebass";

import { ANSWER_STATE, ANSWER_STATE_LABEL } from "../../constants";
import Checkbox from "../../elements/Checkbox";
import Idcc from "../../elements/Idcc";
import excerpt from "../../helpers/excerpt";
import customMoment from "../../libs/customMoment";
import FullAnswerProps from "../../props/FullAnswer";
import {
  Container,
  Content,
  Extract,
  IsPublished,
  Question,
  State,
  Top,
  UpdatedAt,
} from "./index.style";

const Answer = ({ data, isChecked, onCheck, onClick }) => {
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
  } = data;

  const value = [ANSWER_STATE.DRAFT, ANSWER_STATE.PENDING_REVIEW].includes(state)
    ? data.prevalue
    : data.value;

  if (state === ANSWER_STATE.TO_DO) {
    return (
      <Container flexDirection="column">
        <Top justifyContent="space-between">
          <State>{ANSWER_STATE_LABEL[state]}</State>
        </Top>
        <Flex>
          <Checkbox
            isChecked={isChecked}
            onClick={() => onCheck(id)}
            withMarginLeft
            withMarginRight
          />
          <Content flexDirection="column" onClick={() => onClick(id)}>
            <Flex alignItems="baseline">
              <Idcc code={agreement_idcc} name={agreement_name} />
              <Question>{`${question_index}) ${question_value}`}</Question>
            </Flex>
          </Content>
        </Flex>
      </Container>
    );
  }

  return (
    <Container flexDirection="column">
      <Top justifyContent="space-between">
        <State>{ANSWER_STATE_LABEL[state]}</State>
        <Flex alignItems="center">
          <UpdatedAt>{`Modifié ${customMoment(updated_at)
            .tz("Europe/Paris")
            .calendar()}`}</UpdatedAt>
          <IsPublished isDisabled={!is_published}>Publiée</IsPublished>
        </Flex>
      </Top>
      <Flex>
        <Checkbox
          isChecked={isChecked}
          onClick={() => onCheck(id)}
          withMarginLeft
          withMarginRight
        />
        <Content flexDirection="column" onClick={() => onClick(id)}>
          <Flex alignItems="baseline">
            <Idcc code={agreement_idcc} name={agreement_name} />
            <Question>{`${question_index}) ${question_value}`}</Question>
          </Flex>
          {generic_reference === null && <Extract>{excerpt(value)}</Extract>}
          {generic_reference === "labor_code" && (
            <Extract isGeneric>Renvoyé au Code du travail.</Extract>
          )}
          {generic_reference === "national_agreement" && (
            <Extract isGeneric>Renvoyé à la convention collective nationale.</Extract>
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
