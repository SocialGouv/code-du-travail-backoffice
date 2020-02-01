import actionTypes from "./types";

/* MULTIPLE AGREEMENTS ―――――――――――――― */

export const load = (meta = {}) => ({
  meta: {
    ...{
      pageIndex: -1,
      query: ""
    },
    ...meta
  },
  type: actionTypes.AGREEMENTS_LOAD
});
export const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message
  },
  type: actionTypes.AGREEMENTS_LOAD_FAILURE
});
export const loadSuccess = payload => ({
  payload,
  type: actionTypes.AGREEMENTS_LOAD_SUCCESS
});
