const { createServer } = require("http");
const next = require("next");

const routes = require("./routes");

const { NODE_ENV, PORT } = process.env;
const environment = NODE_ENV !== undefined ? NODE_ENV : "development";
const port = PORT !== undefined ? parseInt(PORT) : 3100;

const app = next({ dev: environment !== "production" });

async function start() {
  await app.prepare();

  const server = createServer((req, res) => routes(app, req, res));
  server.listen(port, err => {
    if (err) throw err;

    console.info(`> Ready on http://localhost:${port} (${environment})`);
  });
}

start();
