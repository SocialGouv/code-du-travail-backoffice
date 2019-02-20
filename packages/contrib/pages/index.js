// import axios from "axios";
import React from "react";
// import { Button as ReButton, Flex } from "rebass";
// import styled from "styled-components";

import Main from "../src/layouts/main";
import Login from "../src/components/login";

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };

    this.forceUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
  }

  isAutenticated() {
    const jwt = sessionStorage.getItem("jwt");

    return typeof jwt === "string" && jwt.length > 0;
  }

  render() {
    if (!this.state.isLoading) return <p>Loading...</p>;

    return (
      <Main>
        {!this.isAutenticated() ? (
          <Login onLog={() => this.forceUpdate()} />
        ) : (
          <p>Yo!</p>
        )}
      </Main>
    );
  }
}
