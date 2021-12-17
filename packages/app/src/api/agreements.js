import { apiFetch, getHeaderId } from "../utils";

export const addAgreement = async (name, idcc, parent_id) => {
  const { headers } = await apiFetch(
    "POST",
    "/agreements",
    parent_id ? { idcc, name, parent_id } : { idcc, name },
  );

  const agreementId = getHeaderId(headers.location);

  const { data: questions } = await apiFetch("GET", "/questions");

  return Promise.all(
    questions.map(question =>
      apiFetch("POST", "/answers", {
        agreement_id: agreementId,
        generic_reference: null,
        parent_id: null,
        prevalue: "",
        question_id: question.id,
        state: "draft",
        user_id: null,
        value: "",
      }),
    ),
  );
};
