import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";
import load from "./load";

export default [takeLatest(actionTypes.RESOURCES_LOAD, load)];
