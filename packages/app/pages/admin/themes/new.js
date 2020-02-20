import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customPostgrester from "../../../src/libs/customPostgrester";

export const FIELDS = [
  {
    inputType: "number",
    isReadOnly: true,
    label: "Position",
    name: "position",
    type: "input"
  },
  {
    label: "Titre",
    name: "title",
    type: "input"
  },
  {
    label: "Sous-titre",
    name: "subtitle",
    type: "input"
  },
  {
    helpText: "Une par ligne.",
    label: "Questions-types",
    name: "variations",
    type: "text"
  },
  {
    label: "Introduction",
    name: "introduction",
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
    const { data: parents } = await customPostgrester()
      .orderBy("title")
      .get("/themes");

    const fields = [
      {
        label: "Thème parent",
        name: "parent_id",
        options: parents.map(({ id: value, title: label }) => ({
          label,
          value
        })),
        type: "select"
      },
      ...FIELDS
    ];

    this.setState({
      fields,
      isLoading: false,
      position: parents.length
    });
  }

  render() {
    const { fields, isLoading, position } = this.state;

    if (isLoading) return <AdminMainLayout isLoading />;

    return (
      <AdminForm
        apiPath="/themes"
        defaultData={{ position }}
        fields={fields}
        i18nSubject="thème"
        indexPath="/themes"
      />
    );
  }
}
