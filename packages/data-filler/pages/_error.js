import React from "react";
import Link from "next/link";
import getConfig from "next/config";
import * as Sentry from "@sentry/browser";

import { Alert, Container } from "reactstrap";

const {
  publicRuntimeConfig: { SENTRY_PUBLIC_DSN }
} = getConfig();

if (typeof window !== "undefined" && SENTRY_PUBLIC_DSN) {
  Sentry.init({ dsn: SENTRY_PUBLIC_DSN, debug: true });
}

const notifySentry = (statusCode, message) => {
  if (typeof window === "undefined") {
    return;
  }
  Sentry.withScope(scope => {
    scope.setTag(`ssr`, false);
    Sentry.captureMessage(
      `Error ${statusCode}${message ? ` - ${message}` : ""}`,
      "error"
    );
  });
};

export default class Error extends React.Component {
  static async getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode, message: err && err.message };
  }

  componentDidMount() {
    const { statusCode, message } = this.props;
    if (statusCode && statusCode > 200) {
      notifySentry(statusCode, message);
    }
  }

  render() {
    const { statusCode } = this.props;
    return (
      <Container>
        <br />
        <br />
        <br />
        <br />
        <Alert color="danger">
          {this.props.statusCode
            ? `Une erreur ${statusCode} est apparue sur le serveur`
            : "Une erreur est apparue sur le client"}
          <br />
          <br />
          <Link href="/">
            <a>Retour à la page d’accueil</a>
          </Link>
        </Alert>
      </Container>
    );
  }
}
