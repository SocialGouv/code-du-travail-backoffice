import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";

import AdminQuestionsNewPage from "./new";

export default class AdminQuestionsEditPage extends AdminQuestionsNewPage {
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
      const questionsUri = `/questions?id=eq.${this.props.id}`;
      const tagsSelect = `select=tags(id,value)`;
      const tagsWhere = `select=tags(id,value)`;
      const tagsUri = `/questions_tags?${tagsSelect}&${tagsWhere}`;

      const { data: questions } = await this.axios.get(questionsUri);
      const { data: questionsTags } = await this.axios.get(tagsUri);

      const data = {
        ...questions[0],
        tags: questionsTags.map(({ tags }) => tags)
      };

      this.setState({
        data,
        isLoadingOverwrite: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    if (this.state.isLoadingOverwrite) return <AdminMain isLoading />;

    const { value } = this.state.data;

    return (
      <AdminForm
        apiPath="/questions"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des questions`,
          createOrEditButton: `Bouton mettant à jour la question ${value} dans
                              la base de données à partir des données du
                              formulaire`
        }}
        defaultData={this.state.data}
        fields={this.state.fields}
        id={this.props.id}
        indexPath="/questions"
        name="question"
        title={`Modifier la question « ${value} »`}
      />
    );
  }
}
