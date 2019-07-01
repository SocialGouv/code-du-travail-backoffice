import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";
import styled from "styled-components";

import * as actions from "../actions";
import Button from "../elements/Button";

const Wrapper = styled(Flex)`
  background-color: rgba(249, 249, 252, 0.9);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
`;
const Container = styled(Flex)`
  background-color: var(--color-mummy-tomb);
  border-radius: 0.25rem;
  color: white;
  flex-grow: 1;
  font-weight: 600;
  max-width: 640px;
  padding: 1rem;
`;
const Actions = styled(Flex)``;

const Modal = ({ dispatch, isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <Wrapper alignItems="center" justifyContent="center">
      <Container flexDirection="column">
        <p>{message}</p>
        <Actions justifyContent="flex-end">
          <Button
            color="secondary"
            hasGroup
            onClick={() => dispatch(actions.modal.close())}
          >
            Annuler
          </Button>
          <Button onClick={() => dispatch(actions.modal.submit())}>
            Confirmer
          </Button>
        </Actions>
      </Container>
    </Wrapper>
  );
};

export default connect(({ modal: { isVisible, message } }) => ({
  isVisible,
  message
}))(Modal);
