import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import shortenAgreementName from "../../helpers/shortenAgreementName";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

export default function* loadOne({ meta: { id } }) {
  try {
    const answersRequest = customPostgrester()
      .select("*")
      .select("agreement(idcc,name)")
      .select("question(index,value)")
      .eq("id", id);

    const { data } = yield answersRequest.get("/answers");

    const answer = data[0];
    if (answer.agreement !== null) {
      answer.agreement = {
        ...data[0].agreement,
        name: shortenAgreementName(data[0].agreement.name),
      };
    }

    const answerReferencesRequest = customPostgrester()
      .eq("answer_id", answer.id)
      .orderBy("category")
      .orderBy("value");

    const { data: references } = yield answerReferencesRequest.get("/answers_references");

    answer.references = references;

    yield put(answers.loadOneSuccess(answer));
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(answers.loadOneFailure({ message: null }));
  }
}
