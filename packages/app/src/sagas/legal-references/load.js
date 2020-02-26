import { put } from "redux-saga/effects";

import { legalReferences } from "../../actions";
import convertHtmlToPlainText from "../../helpers/convertHtmlToPlainText";
import excerpt from "../../helpers/excerpt";
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

    const data = rawData.map(({ content, id, num }) => ({
      id,
      name: `[${num !== null ? num : "N/A"}] ${excerpt(convertHtmlToPlainText(content))}`,
    }));

    yield put(legalReferences.loadSuccess({ category, data, query }));
  } catch (err) {
    toast.error(err.message);
    yield put(legalReferences.loadFailure({ message: null }));
  }
}
