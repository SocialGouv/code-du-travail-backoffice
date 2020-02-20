import actionTypes from "./types";

/* MULTIPLE LOGS ―――――――――――――――――――― */

export const load = (meta = {}) => ({
  meta: {
    ...{
      pageIndex: -1,
      query: "",
    },
    ...meta,
  },
  type: actionTypes.LOGS_LOAD,
});
export const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.LOGS_LOAD_FAILURE,
});
export const loadSuccess = payload => ({
  payload,
  type: actionTypes.LOGS_LOAD_SUCCESS,
});

export const deleteOlderThanOneWeek = (ids, answerId) => ({
  meta: {
    answerId,
    ids,
  },
  type: actionTypes.LOGS_DELETE_OLDER_THAN_ONE_WEEK,
});
export const deleteOlderThanOneWeekFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.LOGS_DELETE_OLDER_THAN_ONE_WEEK_FAILURE,
});
