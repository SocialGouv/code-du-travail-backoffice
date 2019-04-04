import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

const FIELDS = [
  {
    type: "text",
    name: "value",
    label: "Intitulé"
  }
];

export default class AdminQuestionsNewPage extends React.Component {
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
      const { data: tags } = await this.axios.get("/tags");

      const fields = [
        ...FIELDS,
        {
          type: "tags",
          name: "tags",
          label: "Étiquettes",
          tags: tags.map(({ id, value }) => ({ id, value })),
          ariaName: "l'étiquette",
          apiPath: "/questions_tags",
          singleName: "tag"
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
        apiPath="/questions"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des questions`,
          createOrEditButton: `Bouton créant une nouvelle question dans la base
                              de données à partir des données du formulaire`
        }}
        fields={this.state.fields}
        indexPath="/questions"
        name="question"
        title="Nouvelle question"
      />
    );
  }
}
