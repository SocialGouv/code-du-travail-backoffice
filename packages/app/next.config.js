const withCss = require("@zeit/next-css");

const API_URI = process.env.API_URI || `/postgrest`;
const API_URI_DOCKER = process.env.API_URI_DOCKER || "http://localhost:3000/postgrest";
const CDTN_API_URL = process.env.CDTN_API_URL || `https://cdtn-api.fabrique.social.gouv.fr`;

module.exports = withCss({
  // https://nextjs.org/docs#build-time-configuration
  env: {
    API_URI,
    API_URI_DOCKER,
    CDTN_API_URL,
  },
});
