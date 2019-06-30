import moment from "moment-timezone";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Idcc from "../../elements/Idcc";
import Checkbox from "../../elements/Checkbox";

// TODO Make it a lib (to globalize the settings).
// https://momentjs.com/docs/#/customization/relative-time/
moment.updateLocale("en", {
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "quelques secondes",
    ss: "%d secondes",
    m: "a minute",
    mm: "%d minutes",
    h: "une heure",
    hh: "%d heures",
    d: "un jour",
    dd: "%d jours",
    M: "un mois",
    MM: "%d mois",
    y: "un an",
    yy: "%d ans"
  }
});

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
  cursor: ${props => (props.isEditable ? "pointer" : "default")};
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

const EDITABLE_STATES = [ANSWER_STATE.DRAFT, ANSWER_STATE.PENDING_REVIEW];

export default ({ data, isChecked, onCheck, onClick }) => {
  const isEditable = EDITABLE_STATES.includes(data.state);
  const isTodo = data.state === ANSWER_STATE.TO_DO;
  const value = data.state === ANSWER_STATE.DRAFT ? data.prevalue : data.value;

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
              {`Proposé par : ${data.user.name}, ${moment(data.updated_at)
                .tz("Europe/Paris")
                .fromNow()}`}
            </TopAuthor>
          )}
        </Top>
        <Content
          flexDirection="column"
          isEditable={isEditable}
          onClick={() => (isEditable ? onClick(data.id) : void 0)}
        >
          <Flex alignItems="baseline">
            <Idcc code={data.agreement.idcc} name={data.agreement.name} />
            <ContentQuestion>
              {`${data.question.index}) ${data.question.value}`}
            </ContentQuestion>
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
      </Flex>
    </Container>
  );
};
