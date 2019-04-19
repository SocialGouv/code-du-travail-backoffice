import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Button from "../../elements/Button";

const Container = styled(Flex)`
  margin-top: 0.5rem;
`;

export default ({ onCancel }) => (
  <Container>
    <Button color="secondary" onClick={onCancel}>
      Annuler ma réponse
    </Button>
  </Container>
);
