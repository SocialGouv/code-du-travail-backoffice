const fetch = require("node-fetch");

// If we are in a non-production environment, we want to load the env vars via
// the monorepo global .env file.
if (!["production", "test"].includes(process.env.NODE_ENV)) {
  require("dotenv").config({ path: `${__dirname}/../../.env` });
}

const { KINTO_BUCKET, KINTO_URI } = process.env;

const parseResponse = res => {
  if (res.status >= 400) {
    throw new Error(`${res.url}: [${res.status}] ${res.statusText}.`);
  }
};

const updateDatabase = async () => {
  try {
    let res;

    // Create bucket:

    res = await fetch(`${KINTO_URI}/buckets`, {
      method: "POST",
      body: JSON.stringify({
        data: {
          id: KINTO_BUCKET
        }
      }),
      headers: {
        // Authorization: `Basic ${Buffer.from("admin:password").toString("base64")}`,
        "Content-Type": "application/json"
      }
    });

    parseResponse(res);

    // Create collections:

    const collections = ["ccns", "glossaire", "requetes", "themes"];
    for (const collection of collections) {
      res = await fetch(`${KINTO_URI}/buckets/${KINTO_BUCKET}/collections`, {
        method: "POST",
        body: JSON.stringify({
          data: {
            id: collection
          }
        }),
        headers: {
          // Authorization: `Basic ${Buffer.from("admin:password").toString("base64")}`,
          "Content-Type": "application/json"
        }
      });

      parseResponse(res);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

updateDatabase();
