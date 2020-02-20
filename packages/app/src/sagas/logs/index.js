import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";
/* MULTIPLE LOGS ―――――――――――――――――――― */
import deleteOlderThanOneWeek from "./deleteOlderThanOneWeek";
import load from "./load";

export default [
  takeLatest(actionTypes.LOGS_DELETE_OLDER_THAN_ONE_WEEK, deleteOlderThanOneWeek),
  takeLatest(actionTypes.LOGS_LOAD, load),
];
