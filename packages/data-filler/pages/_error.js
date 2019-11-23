import React from "react";
import Link from "next/link";

import { Alert, Container } from "reactstrap";

export default class Error extends React.Component {
  static async getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode, message: err && err.message };
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
