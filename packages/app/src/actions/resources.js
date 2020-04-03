import actionTypes from "./types";

const load = query => ({
  meta: {
    query,
  },
  type: actionTypes.RESOURCES_LOAD,
});
const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.RESOURCES_LOAD_FAILURE,
});
const loadSuccess = payload => ({
  payload,
  type: actionTypes.RESOURCES_LOAD_SUCCESS,
});

export default {
  load,
  loadFailure,
  loadSuccess,
};
