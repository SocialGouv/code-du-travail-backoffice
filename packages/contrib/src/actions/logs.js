import actionTypes from "./types";

/* MULTIPLE LOGS ―――――――――――――――――――― */

export const load = (meta = {}) => ({
  meta: {
    ...{
      pageIndex: -1,
      query: ""
    },
    ...meta
  },
  type: actionTypes.LOGS_LOAD
});
export const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message
  },
  type: actionTypes.LOGS_LOAD_FAILURE
});
export const loadSuccess = payload => ({
  payload,
  type: actionTypes.LOGS_LOAD_SUCCESS
});
