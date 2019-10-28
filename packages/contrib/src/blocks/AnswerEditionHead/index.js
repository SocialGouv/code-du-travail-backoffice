import React from "react";
import { Flex } from "rebass";
import styled from "@emotion/styled";

import _Idcc from "../../elements/Idcc";
import Title from "../../elements/Title";
import Actions from "./Actions";
import Tabs from "./Tabs";

const Container = styled(Flex)`
  background-color: white;
  box-shadow: 0 0 0.125rem lightgray;
  padding: 1rem 1rem 0;
  user-select: none;
`;
const Idcc = styled(_Idcc)`
  /* margin-top: 0.375rem; */
`;

export default ({
  agreement,
  currentTab,
  onCancel,
  onSubmit,
  onTabChange,
  question,
  referencesCount,
  tagsCount
}) => (
  <Container justifyContent="space-between">
    <Flex flexDirection="column">
      <Flex alignItems="baseline">
        <Idcc code={agreement.idcc} name={agreement.name} />
        <Title isFirst>{`${question.index}) ${question.value}`}</Title>
      </Flex>
      <Tabs
        currentTab={currentTab}
        onChange={onTabChange}
        referencesCount={referencesCount}
        tagsCount={tagsCount}
      />
    </Flex>
    <Actions onCancel={onCancel} onSubmit={onSubmit} />
  </Container>
);
