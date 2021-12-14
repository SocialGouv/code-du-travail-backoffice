import { apiFetch, getHeaderId } from "../utils";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Provides the functionality of React.useState() with the only difference that
 * it sets a state only if its parent component is still mounted, aka "safe setState".
 */
export default function useSafeState(initialState) {
  const mountedRef = useRef(false);
  const [state, setState] = useState<any>(initialState);

  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const safeSetState = useCallback((...args) => mountedRef.current && setState(...args), []);

  return [state, safeSetState];
}

export const addAgreement = async (
  name: string,
  idcc: string,
  parent_id?: string,
): Promise<any> => {
  const { headers } = await apiFetch("POST", "/agreements", {
    idcc,
    name,
    parent_id,
  });

  const agreementId = getHeaderId(headers.location);

  const { data: questions } = await apiFetch("GET", "/questions");

  return Promise.all(
    questions.map(question =>
      apiFetch("POST", "/answers", {
        agreement_id: agreementId,
        question_id: question.id,
        state: "draft",
        user_id: null,
        parent_id: null,
        prevalue: "",
        generic_reference: null,
        value: "",
      }),
    ),
  );
};
