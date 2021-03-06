const DumDum = require("dumdum");

// const LABOR_LAW_ARTICLES = require("../../../packages/api/data/labor-code.json");

const dumdum = DumDum.create({ locale: "fr" });

// const LEGAL_REFERENCE_CATEGORY = [null, "agreement", "labor_code"];
// const LABOR_LAW_ARTICLES_LENGTH = LABOR_LAW_ARTICLES.length;

// function getRandomAnswerReference(answerId, category) {
//   const answerReference = {
//     answer_id: answerId,
//     category,
//   };

//   switch (category) {
//     case LEGAL_REFERENCE_CATEGORY[0]:
//       return {
//         ...answerReference,
//         url: Math.random() < 0.5 ? "https://example.com" : null,
//         value: dumdum.text([12, 120]),
//       };

//     case LEGAL_REFERENCE_CATEGORY[1]:
//       return {
//         ...answerReference,
//         url: null,
//         value: `Article ${Math.ceil(Math.random() * 99)}`,
//       };

//     case LEGAL_REFERENCE_CATEGORY[2]:
//       return {
//         ...answerReference,
//         dila_id: LABOR_LAW_ARTICLES[Math.floor(Math.random() * LABOR_LAW_ARTICLES_LENGTH)].id,
//         url: null,
//         value: LABOR_LAW_ARTICLES[Math.floor(Math.random() * LABOR_LAW_ARTICLES_LENGTH)].id,
//       };
//   }
// }

// function getRandomAnswerReferences(answerId) {
//   const answerReferences = [];
//   let i = Math.floor(Math.random() * 10);

//   while (i-- > 0) {
//     const categoryIndex = Math.floor(Math.random() * 3);
//     const category = LEGAL_REFERENCE_CATEGORY[categoryIndex];

//     answerReferences.push(getRandomAnswerReference(answerId, category));
//   }

//   return answerReferences;
// }

function getRandomAnswer(diceBalance, question_id, agreement_id) {
  const dice = Math.random();

  switch (true) {
    case dice < diceBalance[0]:
      return {
        agreement_id,
        prevalue: "",
        question_id,
        state: "todo",
        value: "",
      };

    case dice < diceBalance[1]:
      return {
        agreement_id,
        prevalue: dumdum.text([260, 620]),
        question_id,
        state: "draft",
        user_id: "00000000-0000-4000-8000-000000000402",
        value: "",
      };

    case dice < diceBalance[2]:
      return {
        agreement_id,
        prevalue: dumdum.text([260, 620]),
        question_id,
        state: "pending_review",
        user_id: "00000000-0000-4000-8000-000000000402",
        value: "",
      };

    case dice < diceBalance[3]:
      return {
        agreement_id,
        prevalue: dumdum.text([260, 620]),
        question_id,
        state: "under_review",
        user_id: "00000000-0000-4000-8000-000000000402",
        value: dumdum.text([260, 620]),
      };

    case dice < diceBalance[4]:
      return {
        agreement_id,
        prevalue: dumdum.text([260, 620]),
        question_id,
        state: "validated",
        user_id: "00000000-0000-4000-8000-000000000402",
        value: dumdum.text([260, 620]),
      };

    default:
      return {
        agreement_id,
        prevalue: dumdum.text([260, 620]),
        question_id,
        state: "published",
        user_id: "00000000-0000-4000-8000-000000000402",
        value: dumdum.text([260, 620]),
      };
  }
}

exports.seed = async knex => {
  global.spinner.start(`Generating answers...`);

  const questions = await knex("api.questions").orderBy("index");
  const agreements = await knex("api.agreements").orderBy("idcc");

  const { data: publicAnswers } = await global.postgresterClient.get("/public_answers");

  for (const question of questions) {
    const genericAnswer = {
      agreement_id: null,
      prevalue: "",
      question_id: question.id,
      state: "pending_review",
      value: dumdum.text([260, 620]),
    };

    await knex("api.answers").insert([genericAnswer]);

    const answers = [];
    let answersReferences = [];
    const diceBalance = [
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
    ].sort();

    for (const agreement of agreements) {
      global.spinner.text = `Generating answers: [${agreement.idcc}] ${question.index}) ${question.value}`;

      const maybeAnswer = publicAnswers.find(
        ({ agreement_id, question_id }) =>
          agreement_id === agreement.id && question_id === question.id,
      );

      if (maybeAnswer !== undefined) {
        const answer = maybeAnswer;
        answers.push({
          ...answer,
          state: "validated",
        });

        const { data: foundAnswerReferences } = await global.postgresterClient
          .eq("answer_id", answer.id)
          .get("/answers_references");

        answersReferences = answersReferences
          .concat(foundAnswerReferences)
          // eslint-disable-next-line no-unused-vars
          .map(({ is_skipped, ...answerReference }) => answerReference);

        continue;
      }

      answers.push(getRandomAnswer(diceBalance, question.id, agreement.id));
    }

    await knex("api.answers").insert(answers);
    await knex("api.answers_references").insert(answersReferences);
  }

  // const answerIds = await knex("api.answers").map(({ id }) => id);

  // global.spinner.text = `Generating answers references...`;

  // const randomAnswersReferences = answerIds.reduce(
  //   (prev, answerId) => [...prev, ...getRandomAnswerReferences(answerId)],
  //   [],
  // );

  // await knex("api.answers_references").insert(randomAnswersReferences);

  global.spinner.succeed(`Answers generated.`);
};
