import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";
/* MULTIPLE QUESTIONS ――――――――――――――― */
import load from "./load";

export default [takeLatest(actionTypes.QUESTIONS_LOAD, load)];
