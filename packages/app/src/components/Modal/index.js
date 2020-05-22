import PropTypes from "prop-types";
import React from "react";
import reactOnClickOutside from "react-onclickoutside";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../actions";
import Button from "../../elements/Button";
import { Container, Wrapper } from "./index.style";

const Modal = ({ dispatch, message }) => (
  <Container flexDirection="column">
    <p data-testid="message">{message}</p>
    <Flex justifyContent="flex-end">
      <Button
        color="secondary"
        data-testid="button-cancel"
        onClick={() => dispatch(actions.modal.close())}
        withMarginRight
      >
        Annuler
      </Button>
      <Button data-testid="button-confirm" onClick={() => dispatch(actions.modal.submit())}>
        Confirmer
      </Button>
    </Flex>
  </Container>
);

Modal.handleClickOutside = function () {
  const { dispatch } = this.props;

  dispatch(actions.modal.close());
};

Modal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export { Modal };

const ModalWithClickOutside = reactOnClickOutside(Modal);

const ModaWithWrapper = ({ isVisible, ...props }) => {
  if (!isVisible) return null;

  return (
    <Wrapper alignItems="center" justifyContent="center">
      <ModalWithClickOutside {...props} />
    </Wrapper>
  );
};

ModaWithWrapper.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default connect(({ modal: { isVisible, message } }) => ({
  isVisible,
  message,
}))(ModaWithWrapper);
