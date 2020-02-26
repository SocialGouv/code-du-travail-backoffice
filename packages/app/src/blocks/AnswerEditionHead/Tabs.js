import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import AnswerEditionHeadBlockTab from "./Tab";

const Container = styled(Flex)`
  margin-top: 0.5rem;
`;

export const TABS = {
  EDITOR: 0,
  REFERENCES: 1,
};

const AnswerEditionHeadBlockTabs = ({ currentTab, onChange, referencesCount }) => (
  <Container>
    <AnswerEditionHeadBlockTab
      isActive={currentTab === TABS.EDITOR}
      onClick={() => onChange(TABS.EDITOR)}
    >
      Édition
    </AnswerEditionHeadBlockTab>
    <AnswerEditionHeadBlockTab
      isActive={currentTab === TABS.REFERENCES}
      onClick={() => onChange(TABS.REFERENCES)}
    >
      {`Références juridiques (${referencesCount})`}
    </AnswerEditionHeadBlockTab>
  </Container>
);

export default AnswerEditionHeadBlockTabs;
