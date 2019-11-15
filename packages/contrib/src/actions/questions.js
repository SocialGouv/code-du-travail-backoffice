import actionTypes from "./types";

/* MULTIPLE QUESTIONS ――――――――――――――― */

export const load = (meta = {}) => ({
  type: actionTypes.QUESTIONS_LOAD,
  meta: {
    ...{
      pageIndex: -1,
      query: ""
    },
    ...meta
  }
});
export const loadFailure = error => ({
  type: actionTypes.QUESTIONS_LOAD_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadSuccess = payload => ({
  type: actionTypes.QUESTIONS_LOAD_SUCCESS,
  payload
});
