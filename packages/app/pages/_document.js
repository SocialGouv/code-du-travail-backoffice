import { extractCritical } from "emotion-server";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            dangerouslySetInnerHTML={{ __html: styles.css }}
            data-emotion-css={styles.ids.join(" ")}
          />
        </>
      ),
    };
  }

  render() {
    return (
      <Html dir="ltr" lang="fr">
        <Head>
          <meta charSet="utf-8" />
          {/*
            We use this meta to block this website from being referenced in search engines:
            DO NOT ADD A "robot.txt"!
            https://support.google.com/webmasters/answer/6062608
          */}
          <meta content="noindex" name="robots" />
          <link href="/static/icons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/static/icons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/static/icons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/static/site.webmanifest" rel="manifest" />
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
