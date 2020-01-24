import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="fr" dir="ltr">
        <Head>
          <meta charset="utf-8" />
          {/*
            We use this meta to block this website from being referenced in search engines:
            DO NOT ADD A "robot.txt"!
            https://support.google.com/webmasters/answer/6062608
          */}
          <meta name="robots" content="noindex" />
          <title>Outil de contribution au Code du travail numérique</title>
          <link href="/static/icons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/static/icons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/static/icons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/static/site.webmanifest" rel="manifest" />
          <link href="/static/css/socialgouv-bootstrap.min.css" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
