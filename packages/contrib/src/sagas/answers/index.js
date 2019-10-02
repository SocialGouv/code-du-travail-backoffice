import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";

/* ONE ANSWER ―――――――――――――――――――――― */

import loadOne from "./loadOne";

/* MULTIPLE ANSWERS ―――――――――――――――― */

import cancel from "./cancel";
import load from "./load";
import updateGenericReference from "./updateGenericReference";
import updateIsPublished from "./updateIsPublished";
import updateState from "./updateState";
import toggleCheck from "./toggleCheck";

export default [
  takeLatest(actionTypes.ANSWER_LOAD_ONE, loadOne),

  takeLatest(actionTypes.ANSWERS_CANCEL, cancel),
  takeLatest(actionTypes.ANSWERS_LOAD, load),
  takeLatest(actionTypes.ANSWERS_TOGGLE_CHECK, toggleCheck),
  takeLatest(
    actionTypes.ANSWER_UPDATE_GENERIC_REFERENCE,
    updateGenericReference
  ),
  takeLatest(
    actionTypes.ANSWER_UPDATE_IS_PUBLISHED_REFERENCE,
    updateIsPublished
  ),
  takeLatest(actionTypes.ANSWER_UPDATE_STATE, updateState)
];
