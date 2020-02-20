import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customPostgrester from "../../../src/libs/customPostgrester";
import { FIELDS } from "./new";

export default class AdminThemesEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      data: {},
      isLoading: true
    };
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  async componentDidMount() {
    const { id } = this.props;

    const { data: parents } = await customPostgrester()
      .not.eq("id", id)
      .orderBy("title")
      .get("/themes");
    const { data: themes } = await customPostgrester()
      .eq("id", id)
      .get(`/themes`);

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
      data: themes[0],
      fields,
      isLoading: false
    });
  }

  render() {
    const { id } = this.props;
    const { data, fields, isLoading } = this.state;

    if (isLoading) return <AdminMainLayout isLoading />;

    return (
      <AdminForm
        apiPath="/themes"
        defaultData={data}
        fields={fields}
        i18nSubject="thème"
        id={id}
        indexPath="/themes"
      />
    );
  }
}
