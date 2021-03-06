import React from "react";
import { put } from "redux-saga/effects";

import { logs } from "../../actions";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

export default function* load({ meta: { pageIndex, query } }) {
  try {
    const request = customPostgrester().select("*").select("user(*)").orderBy("created_at", true);

    if (pageIndex !== -1) {
      request.page(pageIndex);
    }

    if (query.length > 0) {
      request.ilike("url", query);
    }

    const { data: list, pagesLength } = yield request.get("/logs", true);

    yield put(
      logs.loadSuccess({
        list,
        pageIndex,
        pagesLength,
      }),
    );
  } catch (err) /* istanbul ignore next */ {
    if (err.response !== undefined && err.response.status === 416) {
      const pageIndex = Math.floor(Number(err.response.headers["content-range"].substr(2)) / 10);

      toast.error(
        <span>
          {`Cette page est hors de portée.`}
          <br />
          {`Redirection vers la page n° ${pageIndex + 1}…`}
        </span>,
      );

      return yield load({ meta: { pageIndex, query } });
    }

    toast.error(err.message);
    yield put(logs.loadFailure({ message: null }));
  }
}
