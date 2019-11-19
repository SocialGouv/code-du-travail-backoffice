import React from "react";

import withKinto from "./kinto/withKinto";

import { withRouter } from "next/router";

const forms = {
  requetes: require("./forms/Requete").default,
  ccns: require("./forms/CCN").default,
  themes: require("./forms/Theme").default,
  glossaire: require("./forms/Glossaire").default,
  reponses: require("./forms/Reponse").default
};

const onSubmit = ({ client, bucket, collection, data }) =>
  client
    .bucket(bucket, { headers: {} })
    .collection(collection, { headers: {} })
    .updateRecord({ ...data }, { headers: {} })
    .catch(e => {
      alert("Impossible d'enregistrer");
      throw e;
    });

const onDelete = ({ client, bucket, collection, id }) =>
  client
    .bucket(bucket, { headers: {} })
    .collection(collection, { headers: {} })
    .deleteRecord(id, { headers: {} })
    .catch(e => {
      alert("Impossible de supprimer");
      throw e;
    });

const EditRecord = withKinto(({ client, query, record, router }) => {
  // todo: use json-schema-form when no schema defined
  const Component = forms[query.collection];
  if (!Component) {
    throw new Error(
      `Cannot find editor component for collection ${
        query.collection
      }. Valid collections : ${Object.keys(forms).join(", ")}`
    );
  }

  return (
    <Component
      data={record.data}
      onSubmit={data =>
        onSubmit({
          client,
          bucket: query.bucket,
          collection: query.collection,
          data
        })
      }
      onDelete={() =>
        onDelete({
          client,
          bucket: query.bucket,
          collection: query.collection,
          id: record.data.id
        }).then(() => router.push(`/`))
      }
    />
  );
});

export default withRouter(EditRecord);
