import React from "react";

import Main from "../../src/layouts/Main";
import customAxios from "../../src/lib/customAxios";

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: []
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    const select = "select=*,question(value),labor_agreement(idcc,name)";

    try {
      const { data } = await this.axios.get(`/answers?${select}`);
      this.setState({
        answers: data.filter(({ labor_agreement }) => labor_agreement !== null),
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    return <Main>Admin Dashboard</Main>;
  }
}
