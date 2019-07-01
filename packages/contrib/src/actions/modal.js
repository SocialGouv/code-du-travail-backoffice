import actionTypes from "./types";

export const open = (message, action) => ({
  type: actionTypes.MODAL_OPEN,
  meta: {
    action
  },
  payload: {
    message
  }
});

export const submit = () => ({
  type: actionTypes.MODAL_SUBMIT
});

export const close = () => ({
  type: actionTypes.MODAL_CLOSE
});
