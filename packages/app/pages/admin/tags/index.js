import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

const COLUMNS = [
  {
    Header: "Valeur",
    accessor: "value"
  },
  {
    Header: "Catégorie",
    accessor: data => (data.category !== null ? data.category.value : "Non renseigné"),
    id: "category",
    width: 160
  }
];

const AdminTagsIndexPage = () => (
  <AdminIndex
    apiPath="/tags"
    apiGetPath="/tags?select=*,category:tag_category(*)"
    ariaLabels={{
      cancelDeletionButton: `Bouton annulant la suppression de cette étiquette
                            de la base de données`,
      deleteButton: `Bouton confirmant la suppression de cette étiquette de la
                    base de données`,
      editButton: `Bouton redirigeant vers le formulaire d'édition des données
                  de cette étiquette`,
      newButton: `Bouton redirigeant vers le formulaire de création d'une
                 nouvelle étiquette`,
      removeButton: `Bouton supprimant cette étiquette de la base de données
                    après confirmation`
    }}
    columns={COLUMNS}
    slug="tag"
    title="Étiquettes"
  />
);

export default AdminTagsIndexPage;
