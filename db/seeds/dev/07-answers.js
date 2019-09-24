const DumDum = require("dumdum");

const dumdum = DumDum.create({ locale: "fr" });

exports.seed = async knex => {
  global.spinner.start(`Generating answers...`);

  const questions = await knex("api.questions");
  const agreements = await knex("api.agreements");

  for (let question of questions) {
    global.spinner.start(`Generating answers: ${question.value}`);

    const genericAnswer = {
      state: "pending_review",
      prevalue: "",
      value: dumdum.text([260, 620]),
      question_id: question.id,
      agreement_id: null
    };

    await knex("api.answers").insert([genericAnswer]);

    const answers = agreements.map(agreement => {
      if (question.index <= 2) {
        return {
          state: "todo",
          prevalue: "",
          value: "",
          question_id: question.id,
          agreement_id: agreement.id
        };
      }

      if (question.index <= 4) {
        return {
          state: "draft",
          prevalue: dumdum.text([260, 620]),
          value: "",
          question_id: question.id,
          agreement_id: agreement.id,
          user_id: "00000000-0000-4000-0000-000000000002"
        };
      }

      if (question.index <= 6) {
        return {
          state: "pending_review",
          prevalue: dumdum.text([260, 620]),
          value: "",
          question_id: question.id,
          agreement_id: agreement.id,
          user_id: "00000000-0000-4000-0000-000000000002"
        };
      }

      if (question.index <= 8) {
        return {
          state: "under_review",
          prevalue: dumdum.text([260, 620]),
          value: dumdum.text([260, 620]),
          question_id: question.id,
          agreement_id: agreement.id,
          user_id: "00000000-0000-4000-0000-000000000002"
        };
      }

      return {
        state: "validated",
        prevalue: dumdum.text([260, 620]),
        value: dumdum.text([260, 620]),
        question_id: question.id,
        agreement_id: agreement.id,
        user_id: "00000000-0000-4000-0000-000000000002",
        is_published: Math.random() < 0.75
      };
    });

    await knex("api.answers").insert(answers);
  }

  global.spinner.succeed(`Answers generated.`);
};
