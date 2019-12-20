import actionTypes from "./types";

/* ONE ANSWER ―――――――――――――――――――――― */

export const loadOne = (id, meta = { withReferences: false, withTags: false }) => ({
  type: actionTypes.ANSWER_LOAD_ONE,
  meta: {
    ...meta,
    id
  }
});
export const loadOneFailure = error => ({
  type: actionTypes.ANSWER_LOAD_ONE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadOneSuccess = data => ({
  type: actionTypes.ANSWER_LOAD_ONE_SUCCESS,
  payload: {
    data
  }
});

/* MULTIPLE ANSWERS ―――――――――――――――― */

export const cancel = (ids, next) => ({
  type: actionTypes.ANSWERS_CANCEL,
  meta: {
    ids,
    next
  }
});
export const cancelFailure = error => ({
  type: actionTypes.ANSWERS_CANCEL_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const load = () => ({
  type: actionTypes.ANSWERS_LOAD
});
export const loadFailure = error => ({
  type: actionTypes.ANSWERS_LOAD_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadSuccess = payload => ({
  type: actionTypes.ANSWERS_LOAD_SUCCESS,
  payload
});

export const setFilter = (key, value) => ({
  type: actionTypes.ANSWERS_SET_FILTER,
  meta: {
    key,
    value
  }
});
export const setFilterFailure = error => ({
  type: actionTypes.ANSWERS_SET_FILTER_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const setFilters = filters => ({
  type: actionTypes.ANSWERS_SET_FILTERS,
  meta: {
    filters
  }
});
export const setFiltersFailure = error => ({
  type: actionTypes.ANSWERS_SET_FILTERS_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const toggleCheck = ids => ({
  type: actionTypes.ANSWERS_TOGGLE_CHECK,
  meta: {
    ids
  }
});
export const toggleCheckFailure = error => ({
  type: actionTypes.ANSWERS_TOGGLE_CHECK_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const updateGenericReference = (ids, genericReference, next) => ({
  type: actionTypes.ANSWERS_UPDATE_GENERIC_REFERENCE,
  meta: {
    genericReference,
    ids,
    next
  }
});
export const updateGenericReferenceFailure = error => ({
  type: actionTypes.ANSWERS_UPDATE_GENERIC_REFERENCE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const updateIsPublished = (ids, is, next) => ({
  type: actionTypes.ANSWERS_UPDATE_IS_PUBLISHED_REFERENCE,
  meta: {
    ids,
    is,
    next
  }
});
export const updateIsPublishedFailure = error => ({
  type: actionTypes.ANSWERS_UPDATE_IS_PUBLISHED_REFERENCE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const updateState = (ids, state, next) => ({
  type: actionTypes.ANSWERS_UPDATE_STATE,
  meta: {
    ids,
    next,
    state
  }
});
export const updateStateFailure = error => ({
  type: actionTypes.ANSWERS_UPDATE_STATE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
