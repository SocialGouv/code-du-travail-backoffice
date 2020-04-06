const log = require("@inspired-beings/log");

const { COMMON_HEADERS } = require("../constants");

/**
 * @param {string} path
 * @param {*} error
 * @param {import("http").ServerResponse=} res
 */
function answerWithError(path, error, res) {
  const bodyJson = {
    /** @type {string[]} */
    errors: [],
  };

  switch (true) {
    case typeof error === "string":
      bodyJson.errors.push(error);
      break;

    case typeof error === "object" && typeof error.message === "string":
      // https://stackoverflow.com/a/37133017/2736233
      bodyJson.errors.push(error.message.split("\n", 1)[0]);
      break;

    default:
      bodyJson.errors.push("Unknown error.");
      break;
  }

  if (res !== undefined) {
    res.writeHead(400, COMMON_HEADERS);
    res.end(JSON.stringify(bodyJson));
  }

  bodyJson.errors.map(error => log.err(`[api] [${path}] Error: %s`, error));
}

module.exports = answerWithError;
