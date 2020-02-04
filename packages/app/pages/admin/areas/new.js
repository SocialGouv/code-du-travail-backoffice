import * as R from "ramda";
import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import { AREA_CATEGORY_LABEL } from "../../../src/constants";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input"
  },
  {
    label: "Code",
    name: "code",
    type: "input"
  },
  {
    label: "Type",
    name: "category",
    options: R.pipe(
      R.toPairs,
      R.map(([value, label]) => ({ label, value }))
    )(AREA_CATEGORY_LABEL),
    type: "select"
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
          label: "Zone parente",
          name: "parent_id",
          options: areas.map(({ category, code, id, name }) => ({
            label: `${name} [${AREA_CATEGORY_LABEL[category]} - ${code}]`,
            value: id
          })),
          type: "select"
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
    if (this.state.isLoading) return <AdminMainLayout isLoading />;

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
