import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";
import addReferences from "./addReferences";
import cancel from "./cancel";
import load from "./load";
import loadOne from "./loadOne";
import removeReferences from "./removeReferences";
import setFilter from "./setFilter";
import setFilters from "./setFilters";
import toggleCheck from "./toggleCheck";
import updateGenericReference from "./updateGenericReference";
import updateIsPublished from "./updateIsPublished";
import updateReferences from "./updateReferences";
import updateState from "./updateState";

export default [
  takeLatest(actionTypes.ANSWER_LOAD_ONE, loadOne),

  takeLatest(actionTypes.ANSWERS_ADD_REFERENCES, addReferences),
  takeLatest(actionTypes.ANSWERS_CANCEL, cancel),
  takeLatest(actionTypes.ANSWERS_LOAD, load),
  takeLatest(actionTypes.ANSWERS_REMOVE_REFERENCES, removeReferences),
  takeLatest(actionTypes.ANSWERS_SET_FILTER, setFilter),
  takeLatest(actionTypes.ANSWERS_SET_FILTER_SUCCESS, load),
  takeLatest(actionTypes.ANSWERS_SET_FILTERS, setFilters),
  takeLatest(actionTypes.ANSWERS_SET_FILTERS_SUCCESS, load),
  takeLatest(actionTypes.ANSWERS_TOGGLE_CHECK, toggleCheck),
  takeLatest(actionTypes.ANSWERS_UPDATE_GENERIC_REFERENCE, updateGenericReference),
  takeLatest(actionTypes.ANSWERS_UPDATE_IS_PUBLISHED_REFERENCE, updateIsPublished),
  takeLatest(actionTypes.ANSWERS_UPDATE_REFERENCES, updateReferences),
  takeLatest(actionTypes.ANSWERS_UPDATE_STATE, updateState),
];
