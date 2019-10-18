const Koa = require("koa");
const next = require("next");

const isInternetExplorer = require("./middlewares/isInternetExplorer");
const withAuthentication = require("./middlewares/withAuthentication");
const withPostgres = require("./middlewares/withPostgres");

// If we are in a non-production environment, we want to load the env vars via
// the monorepo global .env file.
if (!["production", "test"].includes(process.env.NODE_ENV)) {
  require("dotenv").config({ path: `${__dirname}/../../../.env` });
}

const routes = require("./routes");

const { NODE_ENV, WEB_PORT } = process.env;
const environment = NODE_ENV !== undefined ? NODE_ENV : "development";

const nextApp = next({ dev: environment !== "production" });

async function start() {
  await nextApp.prepare();

  const koaApp = new Koa();

  // Show a page advising the user to use Chrome if the current browser is IE:
  koaApp.use(isInternetExplorer);

  // Attach Postgres connection (via `ctx.pg`):
  koaApp.use(withPostgres);

  // Attach authentication data (via `ctx.me`):
  koaApp.use(withAuthentication);

  // Attach routes:
  koaApp.use(routes(nextApp));

  koaApp.listen(WEB_PORT, err => {
    if (err) throw err;

    console.info(`> Ready on http://localhost:${WEB_PORT} (${environment})`);
  });
}

start();
