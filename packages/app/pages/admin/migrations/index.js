import moment from "moment-timezone";
import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

const COLUMNS = [
  {
    Header: "Index",
    accessor: "id"
  },
  {
    Header: "Nom",
    accessor: "name"
  },
  {
    Header: "Créé le",
    accessor: data =>
      moment(data.migration_time)
        .tz("Europe/Paris")
        .format("YYYY-MM-DD HH:mm"),
    filterable: false,
    id: "createdAt",
    style: { textAlign: "center" },
    width: 160
  }
];

const AdminMigrationsIndexPage = () => (
  <AdminIndex
    apiPath="/administrator_migrations"
    columns={COLUMNS}
    i18nIsFeminine
    i18nSubject="migration"
    noCreate
    noEdit
    noDelete
    noTimestamps
  />
);

export default AdminMigrationsIndexPage;
