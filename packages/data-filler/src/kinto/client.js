// client for kinto on browser side

// SSR hack
global.fetch = require("node-fetch");

const KintoClient = require("kinto-http");

const { KINTO_URI } = process.env;

const getClient = () => {
  const url = `${KINTO_URI}/v1`;
  const kintoClient = new KintoClient(url, { headers: {} });

  return kintoClient;
};

module.exports = getClient;
