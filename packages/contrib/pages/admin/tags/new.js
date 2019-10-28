import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

const FIELDS = [
  {
    type: "input",
    name: "value",
    label: "Intitulé"
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
          type: "select",
          name: "tag_category_id",
          label: "Catégorie",
          options: tagsCategories.map(({ id: value, value: name }) => ({
            name,
            value
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
    const { fields, isLoading } = this.state;

    if (isLoading) return <AdminMain isLoading />;

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
