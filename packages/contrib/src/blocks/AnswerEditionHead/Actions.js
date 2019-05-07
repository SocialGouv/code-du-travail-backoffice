import React from "react";
import { Flex } from "rebass";

import Button from "../../elements/Button";

export default ({ onCancel, onSubmit }) => (
  <Flex alignItems="baseline">
    <Button color="secondary" hasGroup onClick={onCancel}>
      Annuler ma réponse
    </Button>
    <Button color="primary" onClick={onSubmit}>
      Demander la validation
    </Button>
  </Flex>
);
