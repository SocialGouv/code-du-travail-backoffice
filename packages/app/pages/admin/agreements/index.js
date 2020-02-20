import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";
import shortenAgreementName from "../../../src/helpers/shortenAgreementName";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: ({ name }) => shortenAgreementName(name),
    id: "name",
  },
  {
    Header: "IDCC",
    accessor: "idcc",
    style: { textAlign: "center" },
    width: 64,
  },
];

const AdminAgreementIndexPage = () => (
  <AdminIndex apiPath="/agreements" columns={COLUMNS} i18nIsFeminine i18nSubject="convention" />
);

export default AdminAgreementIndexPage;
