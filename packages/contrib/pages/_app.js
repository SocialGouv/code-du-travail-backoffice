import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";

import Main from "../src/layouts/Main";
import isAuthenticated from "../src/libs/isAuthenticated";
import createStore from "../src/store";

class MainApp extends App {
  constructor(props) {
    super(props);

    this.state = {
      isMountedAndAllowed: false
    };
  }

  static async getInitialProps({ ctx, Component, router }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ctx,
        query: router.query
      });
    }

    return { pageProps };
  }

  async componentDidMount() {
    if (!window.location.pathname.startsWith("/login")) {
      if (!(await isAuthenticated())) {
        // eslint-disable-next-line require-atomic-updates
        window.location.href = `/login?redirectTo=${window.location.pathname}`;
      } else {
        const role = JSON.parse(sessionStorage.getItem("me")).payload.role;

        switch (true) {
          case role === "administrator" &&
            !window.location.pathname.startsWith("/admin"):
            // eslint-disable-next-line require-atomic-updates
            window.location.href = `/admin`;
            break;

          case role === "contributor" &&
            window.location.pathname.startsWith("/admin"):
            // eslint-disable-next-line require-atomic-updates
            window.location.href = `/`;
            break;

          default:
            this.setState({ isMountedAndAllowed: true });
        }
      }

      return;
    }

    this.setState({ isMountedAndAllowed: true });
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Container>
        {!this.state.isMountedAndAllowed ? (
          <Main isLoading />
        ) : (
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        )}
      </Container>
    );
  }
}

export default withRedux(createStore)(withReduxSaga(MainApp));
