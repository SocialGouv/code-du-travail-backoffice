import actionTypes from "./types";

/* MULTIPLE LOGS ―――――――――――――――――――― */

export const load = (meta = {}) => ({
  type: actionTypes.LOGS_LOAD,
  meta: {
    ...{
      pageIndex: -1,
      query: ""
    },
    ...meta
  }
});
export const loadFailure = error => ({
  type: actionTypes.LOGS_LOAD_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadSuccess = payload => ({
  type: actionTypes.LOGS_LOAD_SUCCESS,
  payload
});
