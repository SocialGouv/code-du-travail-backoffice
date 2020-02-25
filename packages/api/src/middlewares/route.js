const answerWithError = require("../helpers/answerWithError");
const LegalReference = require("../controllers/LegalReference");
const { COMMON_HEADERS } = require("../constants");

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
function route(req, res) {
  try {
    switch (true) {
      case /^\/legal-references($|\?)/.test(req.url) && req.method === "OPTIONS":
        res.writeHead(200, COMMON_HEADERS);
        res.end();
        return true;

      case /^\/legal-references($|\?)/.test(req.url) && req.method === "GET":
        LegalReference.index(req, res);
        return true;

      default:
        return false;
    }
  } catch (err) {
    answerWithError("middlewares/route()", err, res);
  }
}

module.exports = route;
