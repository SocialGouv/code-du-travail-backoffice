const { API_URI, API_URI_DOCKER, CDTN_API_URL } = process.env;

module.exports = {
  // https://nextjs.org/docs#build-time-configuration
  env: {
    API_URI,
    API_URI_DOCKER,
    CDTN_API_URL,
  },
};
