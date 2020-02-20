import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customPostgrester from "../../../src/libs/customPostgrester";

export const FIELDS = [
  {
    label: "Question usager",
    name: "question",
    type: "input"
  },
  {
    helpText: "Une par ligne.",
    label: "Questions similaires",
    name: "variations",
    type: "text"
  },
  {
    label: "Réponse générique",
    name: "generic_answer",
    type: "markdown"
  }
];

export default class AdminDefinitionsNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      isLoading: true,
      position: 0
    };
  }

  async componentDidMount() {
    const { data: themes } = await customPostgrester()
      .orderBy("title")
      .get("/themes");

    const fields = [
      {
        label: "Thème",
        name: "theme_id",
        options: themes.map(({ id: value, title: label }) => ({
          label,
          value
        })),
        type: "select"
      },
      ...FIELDS
    ];

    this.setState({
      fields,
      isLoading: false
    });
  }

  render() {
    const { fields, isLoading } = this.state;

    if (isLoading) return <AdminMainLayout isLoading />;

    return (
      <AdminForm
        apiPath="/requests"
        fields={fields}
        i18nIsFeminine
        i18nSubject="requête"
        indexPath="/requests"
      />
    );
  }
}
