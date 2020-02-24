const answerWithError = require("../helpers/answerWithError");
const LegalReference = require("../controllers/LegalReference");

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
function route(req, res) {
  try {
    switch (true) {
      case /^\/legal-references($|\?)/.test(req.url):
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
