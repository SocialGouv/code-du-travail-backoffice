// @ts-check

const AnswerService = require("../services/Answer");

const answerWithError = require("../helpers/answerWithError");
const { COMMON_HEADERS } = require("../constants");

class Answer {
  /**
   * @param {import("http").IncomingMessage} req
   * @param {import("http").ServerResponse} res
   */
  async index(req, res) {
    try {
      const body = await AnswerService.get();

      res.writeHead(200, COMMON_HEADERS);
      res.end(JSON.stringify(body));
    } catch (err) {
      answerWithError("controllers/Answer#index()", err, res);
    }
  }
}

module.exports = new Answer();
