import { useRouter } from "next/router";
import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customPostgrester from "../../../src/libs/customPostgrester";
import getCurrentUser from "../../../src/libs/getCurrentUser";
import toast from "../../../src/libs/toast";
import { apiFetch, getHeaderId } from "../../../src/utils";

export default function AdminNew(props: any): JSX.Element {
  const [isLoading, setIsLoading] = React.useState(true);
  const [fields, setFields] = React.useState([]);
  const { back } = useRouter();

  React.useEffect(() => {
    async function init() {
      const { data: agreements } = await customPostgrester().get("/agreements");
      const fields = [
        {
          label: "Nom",
          name: "name",
          type: "input",
        },
        {
          label: "IDCC",
          name: "idcc",
          type: "input",
        },
        {
          label: "Convention parente",
          name: "parent_id",
          options: agreements.map(({ id, idcc, name }) => ({
            label: `${idcc} - ${name}`,
            value: id,
          })),
          type: "select",
        },
      ];
      setFields(fields);
      setIsLoading(false);
    }
    init();
  }, []);

  const onSubmit = async data => {
    try {
      const { headers } = await apiFetch("POST", "/agreements", {
        idcc: data.idcc,
        name: data.name,
        parent_id: data.parent_id,
      });

      const agreementId = getHeaderId(headers.location);

      const { data: questions } = await apiFetch("GET", "/questions");

      const me = getCurrentUser();

      const promises = [];

      questions.forEach(question => {
        promises.push(
          apiFetch("POST", "/answers", {
            agreement_id: agreementId,
            question_id: question.id,
            state: "draft",
            user_id: me.id,
            parent_id: null,
            prevalue: "",
            generic_reference: null,
            value: "",
          }),
        );
      });

      await Promise.all(promises);

      back();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      {isLoading ? (
        <AdminMain isLoading />
      ) : (
        <AdminForm
          apiPath="/agreements"
          fields={fields}
          i18nIsFeminine={true}
          i18nSubject="convention"
          indexPath="/agreements"
          onSubmit={onSubmit}
        />
      )}
    </>
  );
}
