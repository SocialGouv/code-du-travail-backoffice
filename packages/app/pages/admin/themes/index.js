import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

const COLUMNS = [
  {
    Header: "Titre",
    accessor: "title"
  }
];

const AdminThemesIndexPage = () => (
  <AdminIndex apiPath="/themes" columns={COLUMNS} i18nSubject="thème" />
);

export default AdminThemesIndexPage;
