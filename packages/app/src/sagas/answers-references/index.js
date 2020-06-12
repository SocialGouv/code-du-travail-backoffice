import { takeLatest } from "redux-saga/effects";

import { actionTypes } from "../../actions";
import load from "./load";
import setFilter from "./setFilter";
import setFilters from "./setFilters";

export default [
  takeLatest(actionTypes.ANSWERS_REFERENCES_LOAD, load),
  takeLatest(actionTypes.ANSWERS_REFERENCES_SET_FILTER, setFilter),
  takeLatest(actionTypes.ANSWERS_REFERENCES_SET_FILTERS, setFilters),
];
