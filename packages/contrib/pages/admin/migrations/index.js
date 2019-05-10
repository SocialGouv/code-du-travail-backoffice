import moment from "moment-timezone";
import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

import "../../../node_modules/react-table/react-table.css";

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

export default () => (
  <AdminIndex
    apiPath="/administrator_migrations?order=migration_time.desc"
    ariaLabels={{
      editButton: `Bouton redirigeant vers le formulaire d'édition des données
                  de cette migration`
    }}
    columns={COLUMNS}
    noCreate
    noDelete
    noTimestamps
    slug="migration"
    title="Migrations"
  />
);
