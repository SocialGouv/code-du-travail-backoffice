const express = require("express");
const next = require("next");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  server
    .get("/api/ccn/:ccn.json", async (req, res) => {
      if (req.params.ccn.match(/^KALICONT/)) {
        const ccn = require(`@socialgouv/kali-data/data/${req.params.ccn}.json`);
        res.json(ccn);
      }
      res.status(404).end();
    })
    .get("*", handle);

  server.listen(PORT, err => {
    if (err) {
      throw err;
    }

    console.info(`> Ready on port ${PORT} [${process.env.NODE_ENV}]`);
  });
});
