import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";
/* MULTIPLE LOGS ―――――――――――――――――――― */
import load from "./load";

export default [takeLatest(actionTypes.LOGS_LOAD, load)];
