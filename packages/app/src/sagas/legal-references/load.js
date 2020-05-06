// @ts-check

import { put } from "redux-saga/effects";

import { legalReferences } from "../../actions";
import { LEGAL_REFERENCE_CATEGORY } from "../../constants";
import api from "../../libs/api";
import toast from "../../libs/toast";

export default function* load({ meta: { category, idcc, query } }) {
  try {
    if (query.length === 0) {
      yield put(legalReferences.loadSuccess({ data: [], query }));

      return;
    }

    /** @type {LegalReference.Article[]} */
    const data = yield api.get(
      `/legal-references?category=${category}&idcc=${idcc}&query=${query}`,
    );

    const list = data.map(({ id, index, title }) => ({
      id,
      name:
        category === LEGAL_REFERENCE_CATEGORY.AGREEMENT
          ? `${index !== null ? `[Article ${index}] ` : ""}${title}`
          : index,
    }));

    yield put(legalReferences.loadSuccess({ category, list }));
  } catch (err) {
    toast.error(err.message);
    yield put(legalReferences.loadFailure({ message: null }));
  }
}
