import React from "react";
import { Flex } from "rebass";
import styled from "@emotion/styled";

import BaseEditor from "../../components/Editor";

const Container = styled(Flex)`
  flex-grow: 1;
`;
const Editor = styled(BaseEditor)`
  flex-grow: 1;
`;

export default ({ defaultValue, onChange }) => (
  <Container>
    <Editor defaultValue={defaultValue} onChange={onChange} />
  </Container>
);
