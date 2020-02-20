import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: "name",
  },
];

const AdminDefinitionsIndexPage = () => (
  <AdminIndex apiPath="/definitions" columns={COLUMNS} i18nIsFeminine i18nSubject="définition" />
);

export default AdminDefinitionsIndexPage;
