import actionTypes from "./types";

/* ONE ALERT ―――――――――――――――――――――――― */

export const processOne = key => ({
  meta: {
    key,
  },
  type: actionTypes.ALERT_PROCESS_ONE,
});
export const processOneFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ALERT_PROCESS_ONE_FAILURE,
});
export const processOneSuccess = payload => ({
  payload,
  type: actionTypes.ALERT_PROCESS_ONE_SUCCESS,
});

export const selectOne = key => ({
  meta: {
    key,
  },
  type: actionTypes.ALERT_SELECT_ONE,
});
export const selectOneFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ALERT_SELECT_ONE_FAILURE,
});
export const selectOneSuccess = payload => ({
  payload,
  type: actionTypes.ALERT_SELECT_ONE_SUCCESS,
});

/* MULTIPLE ALERTS ―――――――――――――――――― */

export const load = () => ({
  type: actionTypes.ALERTS_LOAD,
});
export const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ALERTS_LOAD_FAILURE,
});
export const loadSuccess = payload => ({
  payload,
  type: actionTypes.ALERTS_LOAD_SUCCESS,
});
