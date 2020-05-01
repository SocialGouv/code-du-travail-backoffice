import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import _Idcc from "../../elements/Idcc";
import Title from "../../elements/Title";
import AnswerEditionHeadBlockActions from "./Actions";
import AnswerEditionHeadBlockTabs from "./Tabs";

const Container = styled(Flex)`
  background-color: white;
  box-shadow: 0 0 0.125rem lightgray;
  padding: 1rem 1rem 0;
  user-select: none;
`;
const Idcc = styled(_Idcc)`
  /* margin-top: 0.375rem; */
`;

const AnswerEditionHeadBlock = ({
  agreement,
  currentTab,
  onCancel,
  onSubmit,
  onTabChange,
  question,
  referencesCount,
}) => (
  <Container justifyContent="space-between">
    <Flex flexDirection="column">
      <Flex alignItems="baseline">
        <Idcc code={agreement.idcc} name={agreement.name} />
        <Title>{`${question.index}) ${question.value}`}</Title>
      </Flex>
      <AnswerEditionHeadBlockTabs
        currentTab={currentTab}
        onChange={onTabChange}
        referencesCount={referencesCount}
      />
    </Flex>
    <AnswerEditionHeadBlockActions onCancel={onCancel} onSubmit={onSubmit} />
  </Container>
);

export default AnswerEditionHeadBlock;
