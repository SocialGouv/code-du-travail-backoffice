// client for kinto on browser side

// use require for calls from server.js
const getConfig = require("next/config").default;

// SSR hack
global.fetch = require("node-fetch");
const KintoClient = require("kinto-http");

const { publicRuntimeConfig } = getConfig();

const getClient = () => {
  const KINTO_URL =
    typeof window !== "undefined"
      ? publicRuntimeConfig.KINTO_URL
      : (process.env.KINTO_URL_SERVER || "http://kinto:8888") + "/v1";

  console.log(
    "KINTO_URL",
    typeof window !== "undefined" ? "browser" : "server",
    KINTO_URL
  );

  const kintoClient = new KintoClient(KINTO_URL, { headers: {} });
  return kintoClient;
};

module.exports = getClient;
