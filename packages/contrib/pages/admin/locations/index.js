import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

import "../../../node_modules/react-table/react-table.css";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: "name"
  }
];

export default () => (
  <AdminIndex
    apiPath="/locations"
    ariaLabels={{
      cancelDeletionButton: `Bouton annulant la suppression de cette unité
                            de la base de données`,
      deleteButton: `Bouton confirmant la suppression de cette unité de la
                    base de données`,
      editButton: `Bouton redirigeant vers le formulaire d'édition des données
                  de cette unité`,
      newButton: `Bouton redirigeant vers le formulaire de création d'une
                 nouvelle unité`,
      removeButton: `Bouton supprimant cette unité de la base de données après
                    confirmation`
    }}
    columns={COLUMNS}
    slug="location"
    title="Unités"
  />
);
