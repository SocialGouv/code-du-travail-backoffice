import { useRouter } from "next/router";
import React from "react";

import { addAgreement } from "../../../src/api";
import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customPostgrester from "../../../src/libs/customPostgrester";
import toast from "../../../src/libs/toast";

export default function AdminNew() {
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
      await addAgreement(data.name, data.idcc, data.parent_id);
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
