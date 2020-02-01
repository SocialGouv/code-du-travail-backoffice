import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

const COLUMNS = [
  {
    Header: "Intitulé",
    accessor: "value"
  }
];

const AdminTagsCategoriesIndexPage = () => (
  <AdminIndex
    apiPath="/tags_categories"
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
    slug="tag-category"
    title="Étiquettes > Catégories"
  />
);

export default AdminTagsCategoriesIndexPage;
