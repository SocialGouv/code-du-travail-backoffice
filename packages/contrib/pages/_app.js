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
      const role = JSON.parse(sessionStorage.getItem("me")).payload.role;

      switch (true) {
        case role === "administrator" &&
          !window.location.pathname.startsWith("/admin"):
          window.location.href = `/admin`;
          break;

        case role === "contributor" &&
          window.location.pathname.startsWith("/admin"):
          window.location.href = `/`;
          break;

        default:
          this.setState({ isMountedAndAllowed: true });
      }
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <Provider store={reduxStore}>
          {!this.state.isMountedAndAllowed ? (
            <Main isLoading />
          ) : (
            <Component {...pageProps} />
          )}
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MainApp);
