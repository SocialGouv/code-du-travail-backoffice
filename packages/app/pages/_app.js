import App from "next/app";
import React from "react";

import Login from "../src/blocks/Login";
import cache from "../src/cache";
import getMe from "../src/libs/getMe";
import { wrapper } from "../src/store";

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
    const { Component, pageProps } = this.props;
    const { statusCode } = pageProps;

    const hasError = statusCode !== undefined && statusCode >= 400;

    if (hasError || me.isAuthenticated) {
      return <Component {...pageProps} />;
    }

    return <Login onLoggedIn={this.login.bind(this)} />;
  }
}

export default wrapper.withRedux(MainApp);
