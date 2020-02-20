import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
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
    if (this.state.isLoadingOverwrite) return <AdminMainLayout isLoading />;

    return (
      <AdminForm
        apiPath="/questions"
        defaultData={this.state.data}
        fields={this.state.fields}
        i18nIsFeminine
        i18nSubject="question"
        id={this.props.id}
        indexPath="/questions"
        name="question"
      />
    );
  }
}
