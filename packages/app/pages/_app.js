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

    const {
      pageProps: { me },
    } = props;

    cache.set("me", me);
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
