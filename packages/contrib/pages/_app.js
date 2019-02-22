import App, { Container } from "next/app";
import Router from "next/router";
import React from "react";
import { Provider } from "react-redux";

import withReduxStore from "../src/lib/with-redux-store";

class MainApp extends App {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: false
    };
  }

  componentDidMount() {
    if (this.props.router.asPath !== "/" && !this.isAutenticated()) {
      Router.push("/");
    }
  }

  isAutenticated() {
    const jwt = sessionStorage.getItem("jwt");

    return typeof jwt === "string" && jwt.length > 0;
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    switch (true) {
      case this.props.router.asPath !== "/" && !this.state.isMounted:
        return <p>Loading...</p>;

      case this.props.router.asPath !== "/" && !this.isAutenticated():
        return <p>Redirecting to login page...</p>;

      default:
        return (
          <Container>
            <Provider store={reduxStore}>
              <Component {...pageProps} />
            </Provider>
          </Container>
        );
    }
  }
}

export default withReduxStore(MainApp);
