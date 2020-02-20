import withReduxSaga from "next-redux-saga";
import withRedux from "next-redux-wrapper";
import App from "next/app";
import React from "react";
import { Provider } from "react-redux";

import Login from "../src/blocks/Login";
import cache from "../src/cache";
import getMe from "../src/libs/getMe";
import createStore from "../src/store";

class MainApp extends App {
  static async getInitialProps(appContext) {
    const { ctx } = appContext;

    const appProps = await App.getInitialProps(appContext);
    const me = await getMe(ctx);

    return {
      ...appProps,
      me
    };
  }

  constructor(props) {
    super(props);

    const { me } = props;

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
