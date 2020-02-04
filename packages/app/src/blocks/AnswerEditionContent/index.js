import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import BaseEditor from "../../components/Editor";

const Container = styled(Flex)`
  flex-grow: 1;
`;
const Editor = styled(BaseEditor)`
  flex-grow: 1;
`;

const AnswerEditionContentBlock = ({ defaultValue, onChange }) => (
  <Container>
    <Editor defaultValue={defaultValue} onChange={onChange} />
  </Container>
);

export default AnswerEditionContentBlock;
