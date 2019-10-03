import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";

/* ONE COMMENT ――――――――――――――――――――― */

import createOne from "./createOne";

/* MULTIPLE COMMENTS ――――――――――――――― */

import _delete from "./delete";
import load from "./load";

export default [
  takeLatest(actionTypes.COMMENT_CREATE_ONE, createOne),

  takeLatest(actionTypes.COMMENTS_DELETE, _delete),
  takeLatest(actionTypes.COMMENTS_LOAD, load)
];
