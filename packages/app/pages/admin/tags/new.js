import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

const FIELDS = [
  {
    label: "Intitulé",
    name: "value",
    type: "input"
  }
];

export default class AdminTagsNewPage extends React.Component {
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
      const { data: tagsCategories } = await this.axios.get("/tags_categories?order=value.asc");

      const fields = [
        ...FIELDS,
        {
          label: "Catégorie",
          name: "tag_category_id",
          options: tagsCategories.map(({ id: value, value: label }) => ({
            label,
            value
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
    const { fields, isLoading } = this.state;

    if (isLoading) return <AdminMainLayout isLoading />;

    return (
      <AdminForm
        apiPath="/tags"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des étiquettes`,
          createOrEditButton: `Bouton créant une nouvelle étiquette dans la base
                              de données à partir des données du formulaire`
        }}
        fields={fields}
        indexPath="/tags"
        title="Nouvelle étiquette"
      />
    );
  }
}
