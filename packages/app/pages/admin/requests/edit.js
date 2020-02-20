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

    const { data: themes } = await customPostgrester()
      .orderBy("title")
      .get("/themes");
    const { data: requests } = await customPostgrester()
      .eq("id", id)
      .get(`/requests`);

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
      data: requests[0],
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
        apiPath="/requests"
        defaultData={data}
        fields={fields}
        i18nIsFeminine
        i18nSubject="requête"
        id={id}
        indexPath="/requests"
      />
    );
  }
}
