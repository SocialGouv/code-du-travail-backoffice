const withCSS = require("@zeit/next-css");

// If we are in a non-production environment, we want to load the env vars via
// the monorepo global .env file.
if (!["production", "test"].includes(process.env.NODE_ENV)) {
  require("dotenv").config({ path: `${__dirname}/../../.env` });
}

const { DATA_FILLER_PATH, KINTO_BUCKET, KINTO_URI } = process.env;

module.exports = withCSS({
  env: {
    DATA_FILLER_PATH,
    KINTO_URI,
    KINTO_BUCKET
  }
});
