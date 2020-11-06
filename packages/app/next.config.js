const withCss = require("@zeit/next-css");

const { API_DOMAIN, API_PORT_PUBLIC, API_SCHEME, API_URI_DOCKER, CDTN_API_URL } = process.env;

const API_URI = `${API_SCHEME}://${API_DOMAIN}${API_PORT_PUBLIC ? `:${API_PORT_PUBLIC}` : ``}`;

module.exports = withCss({
  // https://nextjs.org/docs#build-time-configuration
  env: {
    API_URI,
    API_URI_DOCKER,
    CDTN_API_URL,
  },
});
