import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";

/* MULTIPLE AGREEMENTS ―――――――――――――― */

import load from "./load";

export default [takeLatest(actionTypes.AGREEMENTS_LOAD, load)];
