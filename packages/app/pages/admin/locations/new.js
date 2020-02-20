import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";
import customPostgrester from "../../../src/libs/customPostgrester";

const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input"
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
      const { data: areas } = await this.postgrest
        .orderBy("category")
        .orderBy("name")
        .get("/areas");

      const fields = [
        ...FIELDS,
        {
          label: "Zone",
          name: "area_id",
          options: areas.map(({ category, id: value, name }) => ({
            label: `[${category.substr(0, 3).toUpperCase()}] ${name}`,
            value
          })),
          type: "select"
        },
        {
          apiPath: "/locations_agreements",
          ariaName: "la convention",
          label: "Conventions",
          name: "agreements",
          singleName: "agreement",
          tags: agreements.map(({ id, idcc, name }) => ({
            id,
            value: `${idcc} - ${name}`
          })),
          type: "tags"
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
        apiPath="/locations"
        fields={this.state.fields}
        i18nIsFeminine
        i18nSubject="unité"
        indexPath="/locations"
        name="location"
      />
    );
  }
}
