const merge = require("webpack-merge");
const withCss = require("@zeit/next-css");

module.exports = withCss({
  // https://github.com/zeit/next.js#runtime-configuration
  publicRuntimeConfig: {
    API_URI: `http://localhost:${process.env.API_PORT}`
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
