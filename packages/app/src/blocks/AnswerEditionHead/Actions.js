import React from "react";
import { Flex } from "rebass";

import Button from "../../elements/Button";

const AnswerEditionHeadBlockActions = ({ onCancel, onSubmit }) => (
  <Flex alignItems="baseline">
    <Button color="secondary" onClick={onCancel} withMarginRight>
      Annuler ma réponse
    </Button>
    <Button color="primary" onClick={onSubmit}>
      Demander la validation
    </Button>
  </Flex>
);

export default AnswerEditionHeadBlockActions;
