import { all } from "redux-saga/effects";

import agreements from "./agreements";
import answers from "./answers";
import comments from "./comments";
import modal from "./modal";
import questions from "./questions";

function* rootSaga() {
  yield all([...agreements, ...answers, ...comments, ...modal, ...questions]);
}

export default rootSaga;
