import Router from "next/router";
import React from "react";

import Login from "../src/components/Login";
import Main from "../src/layouts/Main";
import isAuthenticated from "../src/lib/isAuthenticated";

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.forceUpdate = this.forceUpdate.bind(this);
  }

  async componentDidUpdate() {
    try {
      if (await isAuthenticated()) Router.push("/");
    } catch (error) {
      console.warn(error);
    }
  }

  editAnswer(answerId) {
    Router.push(`/answer/${answerId}`);
  }

  render() {
    return (
      <Main>
        <Login onLog={() => this.forceUpdate()} />
      </Main>
    );
  }
}
