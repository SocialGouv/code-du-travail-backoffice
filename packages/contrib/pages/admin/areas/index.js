import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";
import { AREA_CATEGORY_LABEL } from "../../../src/constants";

const COLUMNS = [
  {
    Header: "Code",
    accessor: "code",
    width: 80
  },
  {
    Header: "Nom",
    accessor: "name"
  },
  {
    Header: "Catégorie",
    accessor: ({ category }) => AREA_CATEGORY_LABEL[category],
    id: "category",
    width: 240
  }
];

const AdminAreasIndexPage = () => (
  <AdminIndex
    apiPath="/areas"
    ariaLabels={{
      editButton: `Bouton redirigeant vers le formulaire d'édition des données
                  de cette zone`,
      newButton: `Bouton redirigeant vers le formulaire de création d'une
                 nouvelle zone`
    }}
    columns={COLUMNS}
    noDelete
    slug="area"
    title="Zones"
  />
);

export default AdminAreasIndexPage;
