const withCss = require("@zeit/next-css");

const { API_URI } = process.env;

module.exports = withCss({
  // https://nextjs.org/docs#build-time-configuration
  env: {
    API_URI
  }
});
