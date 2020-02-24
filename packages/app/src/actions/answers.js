import actionTypes from "./types";

/* ONE ANSWER ―――――――――――――――――――――― */

export const loadOne = id => ({
  meta: {
    id,
  },
  type: actionTypes.ANSWER_LOAD_ONE,
});
export const loadOneFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWER_LOAD_ONE_FAILURE,
});
export const loadOneSuccess = data => ({
  payload: {
    data,
  },
  type: actionTypes.ANSWER_LOAD_ONE_SUCCESS,
});

/* MULTIPLE ANSWERS ―――――――――――――――― */

export const addReferences = (data, next) => ({
  meta: {
    data,
  },
  next,
  type: actionTypes.ANSWERS_ADD_REFERENCES,
});
export const addReferencesFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_ADD_REFERENCES_FAILURE,
});

export const cancel = (ids, next) => ({
  meta: {
    ids,
    next,
  },
  type: actionTypes.ANSWERS_CANCEL,
});
export const cancelFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_CANCEL_FAILURE,
});

export const load = () => ({
  type: actionTypes.ANSWERS_LOAD,
});
export const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_LOAD_FAILURE,
});
export const loadSuccess = payload => ({
  payload,
  type: actionTypes.ANSWERS_LOAD_SUCCESS,
});

export const removeReferences = (ids, next) => ({
  meta: {
    ids,
  },
  next,
  type: actionTypes.ANSWERS_REMOVE_REFERENCES,
});
export const removeReferencesFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_REMOVE_REFERENCES_FAILURE,
});

export const setFilter = (key, value) => ({
  meta: {
    key,
    value,
  },
  type: actionTypes.ANSWERS_SET_FILTER,
});
export const setFilterFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_SET_FILTER_FAILURE,
});

export const setFilters = filters => ({
  meta: {
    filters,
  },
  type: actionTypes.ANSWERS_SET_FILTERS,
});
export const setFiltersFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_SET_FILTERS_FAILURE,
});

export const toggleCheck = ids => ({
  meta: {
    ids,
  },
  type: actionTypes.ANSWERS_TOGGLE_CHECK,
});
export const toggleCheckFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_TOGGLE_CHECK_FAILURE,
});

export const updateGenericReference = (ids, genericReference, next) => ({
  meta: {
    genericReference,
    ids,
    next,
  },
  type: actionTypes.ANSWERS_UPDATE_GENERIC_REFERENCE,
});
export const updateGenericReferenceFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_UPDATE_GENERIC_REFERENCE_FAILURE,
});

export const updateIsPublished = (ids, is, next) => ({
  meta: {
    ids,
    is,
    next,
  },
  type: actionTypes.ANSWERS_UPDATE_IS_PUBLISHED_REFERENCE,
});
export const updateIsPublishedFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_UPDATE_IS_PUBLISHED_REFERENCE_FAILURE,
});

export const updateState = (ids, state, next) => ({
  meta: {
    ids,
    next,
    state,
  },
  type: actionTypes.ANSWERS_UPDATE_STATE,
});
export const updateStateFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_UPDATE_STATE_FAILURE,
});
