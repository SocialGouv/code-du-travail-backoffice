import * as Sentry from "@sentry/browser";
import withReduxSaga from "next-redux-saga";
import withRedux from "next-redux-wrapper";
import App from "next/app";
import React from "react";
import { Provider } from "react-redux";

import Login from "../src/blocks/Login";
import cache from "../src/cache";
import getMe from "../src/libs/getMe";
import createStore from "../src/store";

// https://github.com/zeit/next.js/blob/canary/examples/with-redux-saga/pages/_app.js
class MainApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps({ ctx }) : {};
    pageProps.id = ctx.query.id;
    pageProps.me = await getMe(ctx);

    return { pageProps };
  }

  constructor(props) {
    super(props);

    // https://docs.sentry.io/error-reporting/quickstart/?platform=browsernpm#configure-the-sdk
    Sentry.init({
      dsn: "https://bfc08097bb1142d1b1069e63cf34dcd8@sentry.fabrique.social.gouv.fr/32",
    });

    const {
      pageProps: { me },
    } = props;

    cache.set("me", me);
  }

  static getDerivedStateFromProps() {
    const me = cache.get("me");

    if (me.isAuthenticated) {
      const { id, role, name: username } = me.data;

      Sentry.configureScope(scope => {
        scope.setTag("scope", "app");
        scope.setTag("side", "client");
        scope.setUser({ id, role, username });
      });
    } else {
      Sentry.configureScope(scope => {
        scope.setTag("scope", "app");
        scope.setTag("side", "client");
      });
    }

    return null;
  }

  async login() {
    window.location.reload();
  }

  render() {
    const me = cache.get("me");
    const { Component, pageProps, store } = this.props;
    const { statusCode } = pageProps;

    const hasError = statusCode !== undefined && statusCode >= 400;

    return (
      <Provider store={store}>
        {hasError || me.isAuthenticated ? (
          <Component {...pageProps} />
        ) : (
          <Login onLoggedIn={this.login.bind(this)} />
        )}
      </Provider>
    );
  }
}

export default withRedux(createStore)(withReduxSaga(MainApp));
