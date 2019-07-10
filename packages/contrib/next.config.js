const merge = require("webpack-merge");
const withCss = require("@zeit/next-css");

const { API_URI } = process.env;

module.exports = withCss({
  // https://nextjs.org/docs#build-time-configuration
  env: {
    API_URI
  },

  webpack: config => ({
    ...config,
    module: merge(config.module, {
      rules: [
        {
          test: /\.(gif|jpe?g|png|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
                fallback: {
                  loader: "file-loader",
                  options: {
                    publicPath: "/_next/static/images",
                    outputPath: "static/images"
                  }
                }
              }
            }
          ]
        }
      ]
    })
  })
});
