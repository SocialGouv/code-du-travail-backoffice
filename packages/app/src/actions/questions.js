import actionTypes from "./types";

/* MULTIPLE QUESTIONS ――――――――――――――― */

export const load = (meta = {}) => ({
  meta: {
    ...{
      pageIndex: -1,
      query: "",
    },
    ...meta,
  },
  type: actionTypes.QUESTIONS_LOAD,
});
export const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.QUESTIONS_LOAD_FAILURE,
});
export const loadSuccess = payload => ({
  payload,
  type: actionTypes.QUESTIONS_LOAD_SUCCESS,
});
