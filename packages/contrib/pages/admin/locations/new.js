import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";
import customPostgrester from "../../../src/libs/customPostgrester";

const FIELDS = [
  {
    type: "input",
    name: "name",
    label: "Nom"
  }
];

export default class AdminLocationsNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      isLoading: true
    };
  }

  async componentDidMount() {
    this.axios = customAxios();
    this.postgrest = customPostgrester();

    try {
      const { data: agreements } = await this.axios.get("/agreements");
      const { data: zones } = await this.postgrest
        .orderBy("category")
        .orderBy("name")
        .get("/zones");

      const fields = [
        ...FIELDS,
        {
          type: "select",
          name: "zone_id",
          label: "Zone",
          options: zones.map(({ category, id: value, name }) => ({
            name: `[${category.substr(0, 3).toUpperCase()}] ${name}`,
            value
          }))
        },
        {
          type: "tags",
          name: "agreements",
          label: "Conventions",
          tags: agreements.map(({ id, idcc, name }) => ({
            id,
            value: `${idcc} - ${name}`
          })),
          ariaName: "la convention",
          apiPath: "/locations_agreements",
          singleName: "agreement"
        }
      ];

      this.setState({
        fields,
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    if (this.state.isLoading) return <AdminMain isLoading />;

    return (
      <AdminForm
        apiPath="/locations"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des unités`,
          createOrEditButton: `Bouton créant une nouvelle unité dans la base
                              de données à partir des données du formulaire`
        }}
        fields={this.state.fields}
        indexPath="/locations"
        name="location"
        title="Nouvelle unité"
      />
    );
  }
}
