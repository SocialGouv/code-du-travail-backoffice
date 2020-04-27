// https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html#dependencies-on-global-libraries
/// <reference types="@socialgouv/code-du-travail-backoffice__typings" />

const http = require("http");
const httpProxy = require("http-proxy");
const log = require("@inspired-beings/log");

const answerWithError = require("./helpers/answerWithError");
const logAction = require("./hooks/logAction");
const route = require("./middlewares/route");

const NODE_ENV = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development";
const { API_PORT, DEV_POSTGREST_PORT } = process.env;
let { POSTGREST_URI } = process.env;
if (NODE_ENV === "development") {
  POSTGREST_URI = `http://localhost:${DEV_POSTGREST_PORT}`;
}

const proxy = httpProxy.createProxyServer().on("proxyReq", logAction);

http
  .createServer((req, res) => {
    try {
      const isRouted = route(req, res);
      if (isRouted) return;

      proxy.web(req, res, { target: POSTGREST_URI });
    } catch (err) {
      answerWithError("index.js", err, res);
    }
  })
  .listen(API_PORT);

log.info(`[api] [index.js] Info: Listening on %s (%s).`, API_PORT, NODE_ENV);
