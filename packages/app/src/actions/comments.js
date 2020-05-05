import actionTypes from "./types";

/* ONE COMMENT ――――――――――――――――――――― */

export const addOne = (value, isPrivate, answerId) => ({
  meta: {
    answerId,
    isPrivate,
    value,
  },
  type: actionTypes.COMMENT_CREATE_ONE,
});
export const addOneFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.COMMENT_CREATE_ONE_FAILURE,
});

export const toggleOnePrivacy = () => ({
  type: actionTypes.COMMENT_TOGGLE_PRIVACY,
});

/* MULTIPLE COMMENTS ――――――――――――――― */

export const load = answerId => ({
  meta: {
    answerId,
  },
  type: actionTypes.COMMENTS_LOAD,
});
export const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.COMMENTS_LOAD_FAILURE,
});
export const loadSuccess = payload => ({
  payload,
  type: actionTypes.COMMENTS_LOAD_SUCCESS,
});

export const _delete = (ids, answerId) => ({
  meta: {
    answerId,
    ids,
  },
  type: actionTypes.COMMENTS_DELETE,
});
export const deleteFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.COMMENTS_DELETE_FAILURE,
});
