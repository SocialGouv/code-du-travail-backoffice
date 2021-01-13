import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";
import load from "./load";
import processOne from "./processOne";
import selectOne from "./selectOne";

export default [
  takeLatest(actionTypes.ALERT_PROCESS_ONE, processOne),
  takeLatest(actionTypes.ALERT_SELECT_ONE, selectOne),

  takeLatest(actionTypes.ALERTS_LOAD, load),
];
