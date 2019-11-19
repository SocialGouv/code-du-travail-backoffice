const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  publicRuntimeConfig: {
    KINTO_URL: process.env.KINTO_URL || "/kinto/v1",
    PACKAGE_VERSION: require("./package.json").version,
    SENTRY_PUBLIC_DSN: process.env.SENTRY_PUBLIC_DSN,
    KINTO_BUCKET: "datasets"
  }
});
