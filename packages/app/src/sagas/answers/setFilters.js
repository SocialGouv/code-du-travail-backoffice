import jsCookie from "js-cookie";
import { put, select } from "redux-saga/effects";

import { actionTypes, answers } from "../../actions";
import { SESSION } from "../../constants";
import toast from "../../libs/toast";
import { getAnswersFilters } from "../../selectors";

let lastFiltersCookieKey;

export default function* setFilter({ meta: { filters } }) {
  try {
    if (filters.isGeneric !== undefined) {
      lastFiltersCookieKey = filters.isGeneric
        ? SESSION.GENERIC_ANSWERS_FILTERS
        : SESSION.ANSWERS_FILTERS;
    }
    const lastFilters = jsCookie.get(lastFiltersCookieKey);
    const prevFilters =
      lastFilters !== undefined ? JSON.parse(lastFilters) : yield select(getAnswersFilters);

    const nextFilters = { ...prevFilters, ...filters };
    if (filters.isGeneric === undefined && filters.page === undefined) nextFilters.page = 0;

    jsCookie.set(lastFiltersCookieKey, JSON.stringify(nextFilters));

    yield put({
      payload: { filters: nextFilters },
      type: actionTypes.ANSWERS_SET_FILTERS_SUCCESS,
    });
  } catch (err) {
    toast.error(err.message);
    yield put(answers.setFiltersFailure({ message: null }));
  }
}
