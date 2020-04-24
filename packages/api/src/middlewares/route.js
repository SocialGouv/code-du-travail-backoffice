const AnswerController = require("../controllers/Answer");
const answerWithError = require("../helpers/answerWithError");
const LegalReferenceController = require("../controllers/LegalReference");

const { COMMON_HEADERS } = require("../constants");

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
function route(req, res) {
  try {
    switch (true) {
      case /^\/answers($|\?)/.test(req.url) && req.method === "OPTIONS":
      case /^\/legal-references($|\?)/.test(req.url) && req.method === "OPTIONS":
      case /^\/legal-references\/[0-9a-z]+/i.test(req.url) && req.method === "OPTIONS":
        res.writeHead(200, COMMON_HEADERS);
        res.end();
        return true;

      case /^\/answers($|\?)/.test(req.url) && req.method === "GET":
        AnswerController.index(req, res);
        return true;

      case /^\/legal-references($|\?)/.test(req.url) && req.method === "GET":
        LegalReferenceController.index(req, res);
        return true;

      case /^\/legal-references\/[0-9a-z]+/i.test(req.url) && req.method === "GET":
        LegalReferenceController.get(req, res);
        return true;

      default:
        return false;
    }
  } catch (err) {
    answerWithError("middlewares/route()", err, res);
  }
}

module.exports = route;
