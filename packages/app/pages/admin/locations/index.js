import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: "name",
  },
];

const AdminLocationsIndexPage = () => (
  <AdminIndex apiPath="/locations" columns={COLUMNS} i18nIsFeminine i18nSubject="unité" />
);

export default AdminLocationsIndexPage;
