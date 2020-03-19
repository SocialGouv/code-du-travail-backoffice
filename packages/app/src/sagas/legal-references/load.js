import { put } from "redux-saga/effects";

import { legalReferences } from "../../actions";
import { LEGAL_REFERENCE_CATEGORY } from "../../constants";
import customAxios from "../../libs/customAxios";
import toast from "../../libs/toast";

export default function* load({ meta: { category, idcc, query } }) {
  try {
    if (query.length === 0) {
      yield put(legalReferences.loadSuccess({ data: [], query }));

      return;
    }

    const { data: rawData } = yield customAxios().get(
      `/legal-references?category=${category}&idcc=${idcc}&query=${query}`,
    );

    const data = rawData.map(({ id, index, title }) => ({
      id,
      name:
        category === LEGAL_REFERENCE_CATEGORY.AGREEMENT
          ? `${index !== null ? `[Article ${index}] ` : ""}${title}`
          : index,
    }));

    yield put(legalReferences.loadSuccess({ category, data, query }));
  } catch (err) {
    toast.error(err.message);
    yield put(legalReferences.loadFailure({ message: null }));
  }
}
