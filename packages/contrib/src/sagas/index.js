import { all } from "redux-saga/effects";

import answers from "./answers";
import modal from "./modal";

function* rootSaga() {
  yield all([...answers, ...modal]);
}

export default rootSaga;
