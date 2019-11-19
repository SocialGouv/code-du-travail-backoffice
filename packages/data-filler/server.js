const express = require("express");
const proxyMiddleware = require("http-proxy-middleware");
const next = require("next");

//const routes = require("./src/routes");

// in prod, proxify the KINTO API at /kinto
const kintoProxy = {
  target: process.env.KINTO_URL_SERVER || "http://kinto:8888",
  pathRewrite: { "^/kinto": "" },
  changeOrigin: true
};

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// const sourcemapsForSentryOnly = token => (req, res, next) => {
//   // In production we only want to serve source maps for Sentry
//   console.log("sourcemapsForSentryOnly", req.headers, process.env.NODE_ENV);
//   if (
//     !process.env.NODE_ENV !== "production" &&
//     !!token &&
//     req.headers["x-sentry-token"] !== token
//   ) {
//     res
//       .status(401)
//       .send(
//         "Authentication access token is required to access the source map."
//       );
//     return;
//   }
//   next();
// };

app.prepare().then(() => {
  const server = express();
  const { Sentry } = require("./sentry")(app.buildId);

  server
    .use(Sentry.Handlers.requestHandler())
    //  .get(/\.map$/, sourcemapsForSentryOnly(process.env.SENTRY_TOKEN))
    // setup a kinto proxy
    .use(proxyMiddleware("/kinto", kintoProxy))
    .get("/api/ccn/:ccn.json", async (req, res) => {
      if (req.params.ccn.match(/^KALICONT/)) {
        const ccn = require(`@socialgouv/kali-data/data/${req.params.ccn}.json`);
        res.json(ccn);
      }
      res.status(404).end();
    })
    .get("*", (req, res) => {
      console.log("server handler", req.url);
      return handle(req, res);
    })
    .use(Sentry.Handlers.errorHandler());

  server.listen(PORT, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on port ${PORT} [${process.env.NODE_ENV}]`);
    console.log(`> Proxify ${kintoProxy.target} at /kinto`);
  });
});
