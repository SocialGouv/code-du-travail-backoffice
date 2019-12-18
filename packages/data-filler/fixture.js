const fetch = require("node-fetch");

// If we are in a non-production environment, we want to load the env vars via
// the monorepo global .env file.
if (!["production", "test"].includes(process.env.NODE_ENV)) {
  require("dotenv").config({ path: `${__dirname}/../../.env` });
}

const { KINTO_BUCKET, KINTO_URI } = process.env;

const parseResponse = res => {
  if (res.status >= 400) {
    throw new Error(`${res.url} [${res.status}] : ${res.statusText}`);
  }
};

const updateDatabase = async () => {
  try {
    // create collections
    const collections = ["ccns", "glossaire", "requetes", "themes"];
    for (const collection of collections) {
      await fetch(`${KINTO_URI}/buckets/${KINTO_BUCKET}/collections/${collection}`, {
        method: "PUT",
        body: JSON.stringify({
          data: { id: collection }
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(parseResponse);
    }
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

updateDatabase();
