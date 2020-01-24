const withCss = require("@zeit/next-css");
const withTranspileModules = require("next-transpile-modules");

const {
  API_DOMAIN,
  API_PORT_PUBLIC,
  API_SCHEME,
  API_URI_DOCKER,
  DATA_FILLER_PATH,
  KINTO_BUCKET,
  KINTO_URI
} = process.env;

const API_URI = `${API_SCHEME}://${API_DOMAIN}:${API_PORT_PUBLIC}`;

module.exports = withCss(
  // We use next-transpile-modules in order to transpile the data-filler package source so that it
  // can be imported within this package during webpack build process:
  // https://josephluck.co.uk/blog/next-typescript-monorepo
  withTranspileModules({
    // https://nextjs.org/docs#build-time-configuration
    env: {
      API_URI,
      API_URI_DOCKER,
      DATA_FILLER_PATH,
      KINTO_BUCKET,
      KINTO_URI
    },
    transpileModules: ["@socialgouv/cdtn-data-filler"]
  })
);
