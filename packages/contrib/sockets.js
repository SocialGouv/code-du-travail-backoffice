const AnswerController = require("./controllers/AnswerController");

module.exports = function(server, pool) {
  const io = require("socket.io")(server);
  const answerController = new AnswerController(pool);

  io.on("connect", socket => {
    socket.addListener("saveAnswer", data => answerController.update(data));
  });
};
