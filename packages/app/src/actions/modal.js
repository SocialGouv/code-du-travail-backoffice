import actionTypes from "./types";

export const open = (message, action) => ({
  meta: {
    action,
  },
  payload: {
    message,
  },
  type: actionTypes.MODAL_OPEN,
});

export const submit = () => ({
  type: actionTypes.MODAL_SUBMIT,
});

export const close = () => ({
  type: actionTypes.MODAL_CLOSE,
});
