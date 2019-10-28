import React from "react";
import { Flex } from "rebass/styled-components";
import styled from "styled-components";

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
