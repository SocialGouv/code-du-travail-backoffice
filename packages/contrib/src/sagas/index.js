import { all } from "redux-saga/effects";

import answers from "./answers";
import comments from "./comments";
import modal from "./modal";

function* rootSaga() {
  yield all([...answers, ...comments, ...modal]);
}

export default rootSaga;
