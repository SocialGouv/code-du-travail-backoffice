import React from "react";
import { put } from "redux-saga/effects";

import { agreements } from "../../actions";
import shortenAgreementName from "../../helpers/shortenAgreementName";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

export default function* load({ meta: { pageIndex, query } }) {
  try {
    let request = customPostgrester();

    if (pageIndex !== -1) {
      request = request.page(pageIndex);
    }

    if (query.length > 0) {
      request = request.or.ilike("name", query);
    }

    const { data, pagesLength } = yield request.get("/agreements", true);

    yield put(
      agreements.loadSuccess({
        data: data.map(({ name, ...props }) => ({ name: shortenAgreementName(name), ...props })),
        pageIndex,
        pagesLength,
        query
      })
    );
  } catch (err) {
    if (err.response.status === 416) {
      const pageIndex = Math.floor(Number(err.response.headers["content-range"].substr(2)) / 10);

      toast.error(
        <span>
          {`Cette page est hors de portée.`}
          <br />
          {`Redirection vers la page n° ${pageIndex + 1}…`}
        </span>
      );

      return yield load({ meta: { pageIndex, query } });
    }

    toast.error(err.message);
    yield put(agreements.loadFailure({ message: null }));
  }
}
