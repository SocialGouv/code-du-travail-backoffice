import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";

/* ONE ANSWER ―――――――――――――――――――――― */

import loadOne from "./loadOne";

/* MULTIPLE ANSWERS ―――――――――――――――― */

import cancel from "./cancel";
import load from "./load";
import setFilter from "./setFilter";
import toggleCheck from "./toggleCheck";
import updateGenericReference from "./updateGenericReference";
import updateIsPublished from "./updateIsPublished";
import updateState from "./updateState";

export default [
  takeLatest(actionTypes.ANSWER_LOAD_ONE, loadOne),

  takeLatest(actionTypes.ANSWERS_CANCEL, cancel),
  takeLatest(actionTypes.ANSWERS_LOAD, load),
  takeLatest(actionTypes.ANSWERS_SET_FILTER, setFilter),
  takeLatest(actionTypes.ANSWERS_SET_FILTER_SUCESS, load),
  takeLatest(actionTypes.ANSWERS_TOGGLE_CHECK, toggleCheck),
  takeLatest(actionTypes.ANSWERS_UPDATE_GENERIC_REFERENCE, updateGenericReference),
  takeLatest(actionTypes.ANSWERS_UPDATE_IS_PUBLISHED_REFERENCE, updateIsPublished),
  takeLatest(actionTypes.ANSWERS_UPDATE_STATE, updateState)
];
