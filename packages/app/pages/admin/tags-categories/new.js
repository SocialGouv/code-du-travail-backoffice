import React from "react";

import AdminForm from "../../../src/components/AdminForm";

const FIELDS = [
  {
    label: "Intitulé",
    name: "value",
    type: "input"
  }
];

export default class AdminTagsCategoriesNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: FIELDS
    };
  }

  render() {
    return (
      <AdminForm
        apiPath="/tags_categories"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des catégories
                        d'étiquette`,
          createOrEditButton: `Bouton créant une nouvelle catégorie d'étiquette
                              dans la base de données à partir des données du
                              formulaire`
        }}
        fields={this.state.fields}
        indexPath="/tags-categories"
        title="Nouvelle catégorie d'étiquette"
      />
    );
  }
}
