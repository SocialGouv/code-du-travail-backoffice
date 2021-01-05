const http = require("http");
const httpProxy = require("http-proxy");
const log = require("npmlog");

const answerWithError = require("./helpers/answerWithError");
const logAction = require("./hooks/logAction");

log.enableColor();
const NODE_ENV = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development";
const { API_PORT, DEV_POSTGREST_PORT } = process.env;
let { POSTGREST_URI } = process.env;
if (NODE_ENV === "development") {
  POSTGREST_URI = `http://localhost:${DEV_POSTGREST_PORT}`;
}

const proxy = httpProxy.createProxyServer().on("proxyReq", logAction);

log.info("[api] [index.js]", "Proxify %s.", POSTGREST_URI);

http
  .createServer((req, res) => {
    // k8s probe
    if (req.url === "/healthz" && req.method === "GET") {
      res.end("Hello, world");

      return;
    }
    try {
      proxy.web(req, res, { target: POSTGREST_URI });
    } catch (err) {
      answerWithError("index.js", err, res);
    }
  })
  .listen(API_PORT);

log.info("[api] [index.js]", "Listening on %s (%s).", API_PORT, NODE_ENV);
