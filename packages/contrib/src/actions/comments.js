import actionTypes from "./types";

export const load = answerId => ({
  type: actionTypes.COMMENTS_LOAD,
  meta: {
    answerId
  }
});
export const loadFailure = error => ({
  type: actionTypes.COMMENTS_LOAD_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadSuccess = data => ({
  type: actionTypes.COMMENTS_LOAD_SUCCESS,
  payload: {
    data
  }
});

export const add = (answerId, value) => ({
  type: actionTypes.COMMENTS_ADD,
  meta: {
    answerId,
    value
  }
});
export const addFailure = error => ({
  type: actionTypes.COMMENTS_ADD_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const remove = (id, answerId) => ({
  type: actionTypes.COMMENTS_REMOVE,
  meta: {
    answerId,
    id
  }
});
export const removeFailure = error => ({
  type: actionTypes.COMMENTS_REMOVE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
