const PREVALUE =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ` +
  `tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ` +
  `veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ` +
  `commodo consequat.`;

const VALUE =
  `Duis aute irure dolor in reprehenderit in voluptate ` +
  `velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint ` +
  `occaecat cupidatat non proident, sunt in culpa qui officia deserunt ` +
  `mollit anim id est laborum.`;

exports.seed = async knex => {
  global.spinner.start(`Generating answers...`);

  const questions = await knex("api.questions");
  const agreements = await knex("api.agreements");

  for (let question of questions) {
    global.spinner.start(`Generating answers: ${question.value}`);

    const genericAnswer = {
      state: "pending_review",
      prevalue: "",
      value: VALUE,
      question_id: question.id,
      agreement_id: null
    };

    await knex("api.answers").insert([genericAnswer]);

    const answers = agreements.map(agreement => {
      if (question.index < 7) {
        return {
          state: "todo",
          prevalue: "",
          value: "",
          question_id: question.id,
          agreement_id: agreement.id
        };
      }

      if (question.index < 8) {
        return {
          state: "draft",
          prevalue: PREVALUE,
          value: "",
          question_id: question.id,
          agreement_id: agreement.id,
          user_id: "00000000-0000-4000-0000-000000000002"
        };
      }

      if (question.index < 9) {
        return {
          state: "pending_review",
          prevalue: PREVALUE,
          value: "",
          question_id: question.id,
          agreement_id: agreement.id,
          user_id: "00000000-0000-4000-0000-000000000002"
        };
      }

      if (question.index < 10) {
        return {
          state: "under_review",
          prevalue: PREVALUE,
          value: VALUE,
          question_id: question.id,
          agreement_id: agreement.id,
          user_id: "00000000-0000-4000-0000-000000000002"
        };
      }

      return {
        state: "validated",
        prevalue: PREVALUE,
        value: VALUE,
        question_id: question.id,
        agreement_id: agreement.id,
        user_id: "00000000-0000-4000-0000-000000000002"
      };
    });

    await knex("api.answers").insert(answers);
  }

  global.spinner.succeed(`Answers generated.`);
};
