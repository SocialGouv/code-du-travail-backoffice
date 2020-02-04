import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import AdminTagsNewPage from "./new";

export default class AdminTagsEditPage extends AdminTagsNewPage {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      data: {},
      isLoadingOverwrite: true
    };
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  async componentDidMount() {
    await super.componentDidMount();

    try {
      const tagsSelect = `select=*,category:tag_category(*)`;
      const tagsWhere = `id=eq.${this.props.id}`;

      const { data: tags } = await this.axios.get(`/tags?${tagsSelect}&${tagsWhere}`);

      const data = tags[0];

      this.setState({
        data,
        isLoadingOverwrite: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    if (this.state.isLoadingOverwrite) return <AdminMainLayout isLoading />;

    const { value } = this.state.data;

    return (
      <AdminForm
        apiPath="/tags"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des étiquettes`,
          createOrEditButton: `Bouton mettant à jour l'étiquette "${value}"
                              dans la base de données à partir des données du
                              formulaire`
        }}
        defaultData={this.state.data}
        fields={this.state.fields}
        id={this.props.id}
        indexPath="/tags"
        title={`Modifier l'étiquette « ${value} »`}
      />
    );
  }
}
