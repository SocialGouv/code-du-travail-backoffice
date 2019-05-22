import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

import { ZONE_CATEGORY_LABEL } from "../../../src/constants";

const FIELDS = [
  {
    type: "input",
    name: "name",
    label: "Nom"
  }
];

export default class AdminZonesNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      isLoading: true
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    try {
      const order = `order=name.asc`;
      const { data: zones } = await this.axios.get(`/zones?${order}`);

      const fields = [
        ...FIELDS,
        {
          type: "select",
          name: "parent_id",
          label: "Zone parente",
          options: zones.map(({ category, code, id, name }) => ({
            name: `${name} [${ZONE_CATEGORY_LABEL[category]} - ${code}]`,
            value: id
          }))
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
        apiPath="/zones"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des unités`,
          createOrEditButton: `Bouton créant une nouvelle unité dans la base
                              de données à partir des données du formulaire`
        }}
        fields={this.state.fields}
        indexPath="/zones"
        name="location"
        title="Nouvelle zones"
      />
    );
  }
}
