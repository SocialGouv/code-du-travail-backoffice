const Koa = require("koa");
const next = require("next");

const isInternetExplorer = require("./middlewares/isInternetExplorer");
const withAuthentication = require("./middlewares/withAuthentication");
const withPostgres = require("./middlewares/withPostgres");

const routes = require("./routes");

const NODE_ENV = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development";
const { WEB_DOMAIN, WEB_PORT, WEB_SCHEME } = process.env;

const WEB_URI = `${WEB_SCHEME}://${WEB_DOMAIN}:${WEB_PORT}`;

const nextApp = next({ dev: NODE_ENV === "development" });

async function start() {
  await nextApp.prepare();

  const koaApp = new Koa();

  // Show a page advising the user to use Chrome if the current browser is IE:
  koaApp.use(isInternetExplorer);

  // Attach PostgreSQL connection (via `ctx.pg`):
  koaApp.use(withPostgres);

  // Attach authentication data (via `ctx.me`):
  koaApp.use(withAuthentication);

  // Attach routes:
  koaApp.use(routes(nextApp));

  koaApp.listen(WEB_PORT, err => {
    if (err) throw err;

    console.info(`> Website ready on ${WEB_URI} (${NODE_ENV})`);
  });
}

start();
