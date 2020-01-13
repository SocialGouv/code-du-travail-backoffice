const withCss = require("@zeit/next-css");
const dotenv = require("dotenv");
const withTranspileModules = require("next-transpile-modules");

// If we are in a non-production environment, we want to load the env vars via
// the monorepo global .env file.
if (!["production", "test"].includes(process.env.NODE_ENV)) {
  dotenv.config({ path: `${__dirname}/../../.env` });
}

const { API_DOCKER_URI, API_URI, DATA_FILLER_PATH, DB_URI, KINTO_BUCKET, KINTO_URI } = process.env;

module.exports = withCss(
  // We use next-transpile-modules in order to transpile the data-filler package source so that it
  // can be imported within this package during webpack build process:
  // https://josephluck.co.uk/blog/next-typescript-monorepo
  withTranspileModules({
    // https://nextjs.org/docs#build-time-configuration
    env: {
      API_DOCKER_URI,
      API_URI,
      DATA_FILLER_PATH,
      DB_URI,
      KINTO_BUCKET,
      KINTO_URI
    },
    transpileModules: ["@socialgouv/cdtn-data-filler"]
  })
);
