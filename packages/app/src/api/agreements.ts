import { apiFetch, getHeaderId } from "../utils";
import pMap from "p-map";

export const addAgreement = async (
  name: string,
  idcc: string,
  parent_id?: string,
  concurrency = 4,
) => {
  const { headers } = await apiFetch("POST", "/agreements", {
    idcc,
    name,
    parent_id,
  });

  const agreementId = getHeaderId(headers.location);

  const { data: questions } = await apiFetch("GET", "/questions");

  return await pMap(
    questions.map(question => ({
      agreement_id: agreementId,
      question_id: question.id,
      state: "draft",
      user_id: null,
      parent_id: null,
      prevalue: "",
      generic_reference: null,
      value: "",
    })),
    input => apiFetch("POST", "/answers", input),
    { concurrency },
  );
};
