import { put, select } from "redux-saga/effects";

import { actionTypes, answers } from "../../actions";
import toast from "../../libs/toast";
import { getAnswersFilters } from "../../selectors";

export default function* setFilter({ meta: { key, value } }) {
  try {
    const filters = yield select(getAnswersFilters);

    const nextFilters =
      key === "page"
        ? {
            ...filters,
            page: value
          }
        : { ...filters, page: 0, [key]: value };

    yield put({
      type: actionTypes.ANSWERS_SET_FILTER_SUCESS,
      payload: { filters: nextFilters }
    });
  } catch (err) {
    toast.error(err.message);
    yield put(answers.setFilterFailure({ message: null }));
  }
}
