import * as R from "ramda";
import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

import { AREA_CATEGORY_LABEL } from "../../../src/constants";

const FIELDS = [
  {
    type: "input",
    name: "name",
    label: "Nom"
  },
  {
    type: "input",
    name: "code",
    label: "Code"
  },
  {
    type: "select",
    name: "category",
    label: "Type",
    options: R.pipe(
      R.toPairs,
      R.map(([value, name]) => ({ name, value }))
    )(AREA_CATEGORY_LABEL)
  }
];

export default class AdminAreasNewPage extends React.Component {
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
      const { data: areas } = await this.axios.get(`/areas?${order}`);

      const fields = [
        ...FIELDS,
        {
          type: "select",
          name: "parent_id",
          label: "Zone parente",
          options: areas.map(({ category, code, id, name }) => ({
            name: `${name} [${AREA_CATEGORY_LABEL[category]} - ${code}]`,
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
        apiPath="/areas"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des unités`,
          createOrEditButton: `Bouton créant une nouvelle unité dans la base
                              de données à partir des données du formulaire`
        }}
        fields={this.state.fields}
        indexPath="/areas"
        name="location"
        title="Nouvelle zones"
      />
    );
  }
}
