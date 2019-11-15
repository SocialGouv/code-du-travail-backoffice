import actionTypes from "./types";

/* MULTIPLE AGREEMENTS ―――――――――――――― */

export const load = (meta = {}) => ({
  type: actionTypes.AGREEMENTS_LOAD,
  meta: {
    ...{
      pageIndex: -1,
      query: ""
    },
    ...meta
  }
});
export const loadFailure = error => ({
  type: actionTypes.AGREEMENTS_LOAD_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadSuccess = payload => ({
  type: actionTypes.AGREEMENTS_LOAD_SUCCESS,
  payload
});
