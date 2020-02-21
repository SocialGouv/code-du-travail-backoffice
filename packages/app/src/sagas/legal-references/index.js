import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";
import load from "./load";

export default [takeLatest(actionTypes.LEGAL_REFERENCES_LOAD, load)];
