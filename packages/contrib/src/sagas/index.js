import { all } from "redux-saga/effects";

import answers from "./answers";

function* rootSaga() {
  yield all([...answers]);
}

export default rootSaga;
