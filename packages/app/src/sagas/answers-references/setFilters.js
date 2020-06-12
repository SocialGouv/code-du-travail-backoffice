import jsCookie from "js-cookie";
import { put, select } from "redux-saga/effects";

import * as actions from "../../actions";
import { SESSION } from "../../constants";
import toast from "../../libs/toast";
import { getAnswersReferencesFilters } from "../../selectors";

export default function* setFilter({ meta: { filters } }) {
  try {
    const lastFilters = jsCookie.get(SESSION.ANSWERS_REFERENCES_FILTERS);
    const prevFilters =
      lastFilters !== undefined
        ? JSON.parse(lastFilters)
        : yield select(getAnswersReferencesFilters);

    const nextFilters = { ...prevFilters, ...filters };
    jsCookie.set(SESSION.ANSWERS_REFERENCES_FILTERS, JSON.stringify(nextFilters));

    yield put({
      payload: { filters: nextFilters },
      type: actions.actionTypes.ANSWERS_REFERENCES_SET_FILTERS_SUCCESS,
    });

    yield put(actions.answersReferences.load(0));
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(actions.answersReferences.setFiltersFailure({ message: null }));
  }
}
