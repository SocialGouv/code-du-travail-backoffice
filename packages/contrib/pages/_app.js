import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";

import withReduxStore from "../src/libs/withReduxStore";

import Main from "../src/layouts/Main";
import isAuthenticated from "../src/libs/isAuthenticated";

class MainApp extends App {
  constructor(props) {
    super(props);

    this.state = {
      isMountedAndAllowed: false
    };
  }

  async componentDidMount() {
    if (
      !window.location.pathname.startsWith("/login") &&
      !(await isAuthenticated())
    ) {
      window.location.href = `/login?redirectTo=${window.location.pathname}`;
    } else {
      this.setState({ isMountedAndAllowed: true });
    }
  }

  render() {
    if (!this.state.isMountedAndAllowed) return <Main isLoading />;

    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MainApp);
