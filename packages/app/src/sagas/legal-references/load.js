// @ts-check

import { put } from "redux-saga/effects";

import { legalReferences } from "../../actions";
import * as C from "../../constants";
import dilaApi from "../../libs/dilaApi";
import toast from "../../libs/toast";

export default function* load({ meta: { category, idcc, query } }) {
  try {
    /** @type {{ category: string, list: Array<{ id: string, name: string }> }} */
    const response = {
      category,
      list: [],
    };

    if (query.length === 0) {
      yield put(legalReferences.loadSuccess(response));

      return;
    }

    if (category === C.LEGAL_REFERENCE_CATEGORY.AGREEMENT) {
      const path = `/agreement/articles?agreementIdOrIdcc=${idcc}&query=${query}`;
      /** @type {DilaApi.Article[]} */
      const articles = yield dilaApi.get(path);

      response.list = articles.map(article => ({
        ...article,
        name: `${article.index.length > 0 ? `[Article ${article.index}] ` : ""}${article.path}`,
      }));
    } else {
      const path = `/code/articles?codeId=LEGITEXT000006072050&query=${query}`;
      /** @type {DilaApi.Article[]} */
      const articles = yield dilaApi.get(path);

      response.list = articles.map(article => ({
        ...article,
        name: article.index,
      }));
    }

    yield put(legalReferences.loadSuccess(response));
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(legalReferences.loadFailure({ message: null }));
  }
}
