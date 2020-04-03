import { put } from "redux-saga/effects";

import { resources } from "../../actions";
import toast from "../../libs/toast";

const BASE_URL = "https://api-master-code-travail.dev.fabrique.social.gouv.fr/api/v1";

// https://master-code-travail.dev.fabrique.social.gouv.fr/fiche-ministere-travail/le-contrat-a-duree-determinee-cdd#Dans-quelles-conditions-le-contrat-peut-il-etre-rompu
export default function* load({ meta: { query } }) {
  try {
    let data;
    if (query.length === 0) {
      const url = `${BASE_URL}/search?q=${query}`;
      const { articles, documents, themes } = yield fetch(url);

      data = [...articles, ...documents, ...themes];
    } else {
      data = [];
    }

    yield put(resources.loadSuccess({ data, query }));
  } catch (err) {
    toast.error(err.message);
    yield put(resources.loadFailure({ message: null }));
  }
}
