import React from "react";
import App, { Container } from "next/app";
import getConfig from "next/config";
import Head from "next/head";
import * as Sentry from "@sentry/browser";

import KintoContext from "../src/kinto/KintoContext";
import getClient from "../src/kinto/client";

const {
  publicRuntimeConfig: { SENTRY_PUBLIC_DSN }
} = getConfig();

//console.log("SENTRY_PUBLIC_DSN", SENTRY_PUBLIC_DSN);

if (typeof window !== "undefined" && SENTRY_PUBLIC_DSN) {
  Sentry.init({ dsn: SENTRY_PUBLIC_DSN, debug: true });
}

class MyApp extends App {
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps } = this.props;
    const kintoClient = getClient();
    return (
      <Container>
        <Head>
          <title>Dataset editor</title>
          <link
            rel="stylesheet"
            href="https://incubateur.social.gouv.fr/bootstrap/master/@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"
            integrity="grB93+Lj8+H7BK2kCBM0dGAJD+8tE7pYqy6qkcykr8DfCJt7PhJOF998Bwj7BAWc"
            crossOrigin="anonymous"
          />
        </Head>
        {/* provide a kinto client */}
        <KintoContext.Provider value={{ client: kintoClient }}>
          <Component {...pageProps} />
        </KintoContext.Provider>
      </Container>
    );
  }
}

export default MyApp;
