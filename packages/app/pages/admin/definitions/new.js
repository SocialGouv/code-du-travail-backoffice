import React from "react";

import AdminForm from "../../../src/components/AdminForm";

const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input"
  },
  {
    helpText: "Une par ligne.",
    label: "Abbréviations",
    name: "abbreviations",
    type: "text"
  },
  {
    helpText: "Une par ligne.",
    label: "Variantes",
    name: "variations",
    type: "text"
  },
  {
    label: "Définition",
    name: "value",
    type: "markdown"
  }
];

export default class AdminDefinitionsNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.fields = FIELDS;
  }

  render() {
    return (
      <AdminForm
        apiPath="/definitions"
        fields={this.fields}
        i18nIsFeminine
        i18nSubject="définition"
        indexPath="/definitions"
      />
    );
  }
}
