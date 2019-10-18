const withCss = require("@zeit/next-css");

// If we are in a non-production environment, we want to load the env vars via
// the monorepo global .env file.
if (!["production", "test"].includes(process.env.NODE_ENV)) {
  require("dotenv").config({ path: `${__dirname}/../../.env` });
}

const { API_URI } = process.env;

module.exports = withCss({
  // https://nextjs.org/docs#build-time-configuration
  env: {
    API_URI
  }
});
