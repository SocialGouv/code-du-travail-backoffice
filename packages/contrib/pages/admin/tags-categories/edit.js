import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";
import AdminTagsCategoriesNewPage from "./new";

class AdminTagsCategoriesEditPage extends AdminTagsCategoriesNewPage {
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
    const axios = customAxios();

    try {
      const uri = `/tags_categories?id=eq.${this.props.id}`;

      const { data: tagsCategories } = await axios.get(uri);

      const data = tagsCategories[0];

      this.setState({
        data,
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    if (this.state.isLoading) return <AdminMain isLoading />;

    const { value } = this.state.data;

    return (
      <AdminForm
        apiPath="/tags_categories"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des catégories
                        d'étiquette`,
          createOrEditButton: `Bouton mettant à jour la catégorie d'étiquette
                              "${value}" dans la base de données à partir des
                              données du formulaire`
        }}
        defaultData={this.state.data}
        fields={this.state.fields}
        id={this.props.id}
        indexPath="/tags-categories"
        title={`Modifier la catégorie d'étiquette « ${value} »`}
      />
    );
  }
}

export default AdminTagsCategoriesEditPage;
