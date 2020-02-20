const DumDum = require("dumdum");

const LABOR_LAW_REFERENCES = require("../../../packages/app/src/data/labor-law-references.json");

const dumdum = DumDum.create({ locale: "fr" });

const ANSWER_REFERENCE_CATEGORY = [null, "agreement", "labor_code"];
const LABOR_LAW_REFERENCES_LENGTH = LABOR_LAW_REFERENCES.length;

function getRandomAnswerReference(answerId, category) {
  const answerReference = {
    answer_id: answerId,
    category,
  };

  switch (category) {
    case ANSWER_REFERENCE_CATEGORY[0]:
      return {
        ...answerReference,
        value: dumdum.text([12, 120]),
        url: Math.random() < 0.5 ? "https://example.com" : null,
      };

    case ANSWER_REFERENCE_CATEGORY[1]:
      return {
        ...answerReference,
        value: `Article ${Math.ceil(Math.random() * 99)}`,
        url: null,
      };

    case ANSWER_REFERENCE_CATEGORY[2]:
      return {
        ...answerReference,
        value: LABOR_LAW_REFERENCES[Math.floor(Math.random() * LABOR_LAW_REFERENCES_LENGTH)],
        url: null,
      };
  }
}

function getRandomAnswerReferences(answerId) {
  const answerReferences = [];
  let i = Math.floor(Math.random() * 5);

  while (i-- > 0) {
    const categoryIndex = Math.floor(Math.random() * 3);
    const category = ANSWER_REFERENCE_CATEGORY[categoryIndex];

    answerReferences.push(getRandomAnswerReference(answerId, category));
  }

  return answerReferences;
}

exports.seed = async knex => {
  global.spinner.start(`Generating answers...`);

  const questions = await knex("api.questions");
  const agreements = await knex("api.agreements");
  const activeAgreementIds = await knex("api.locations_agreements").map(
    ({ agreement_id }) => agreement_id,
  );

  for (let question of questions) {
    global.spinner.start(`Generating answers: ${question.value}`);

    const genericAnswer = {
      state: "pending_review",
      prevalue: "",
      value: dumdum.text([260, 620]),
      question_id: question.id,
      agreement_id: null,
    };

    await knex("api.answers").insert([genericAnswer]);

    const diceBalance = [Math.random(), Math.random(), Math.random(), Math.random()].sort();

    const answers = agreements.map(agreement => {
      if (!activeAgreementIds.includes(agreement.id)) {
        return {
          state: "todo",
          prevalue: "",
          value: "",
          question_id: question.id,
          agreement_id: agreement.id,
        };
      }

      const dice = Math.random();

      switch (true) {
        case dice < diceBalance[0]:
          return {
            state: "todo",
            prevalue: "",
            value: "",
            question_id: question.id,
            agreement_id: agreement.id,
          };

        case dice < diceBalance[1]:
          return {
            state: "draft",
            prevalue: dumdum.text([260, 620]),
            value: "",
            question_id: question.id,
            agreement_id: agreement.id,
            user_id: "00000000-0000-4000-8000-000000000402",
          };

        case dice < diceBalance[2]:
          return {
            state: "pending_review",
            prevalue: dumdum.text([260, 620]),
            value: "",
            question_id: question.id,
            agreement_id: agreement.id,
            user_id: "00000000-0000-4000-8000-000000000402",
          };

        case dice < diceBalance[3]:
          return {
            state: "under_review",
            prevalue: dumdum.text([260, 620]),
            value: dumdum.text([260, 620]),
            question_id: question.id,
            agreement_id: agreement.id,
            user_id: "00000000-0000-4000-8000-000000000402",
          };

        default:
          return {
            state: "validated",
            prevalue: dumdum.text([260, 620]),
            value: dumdum.text([260, 620]),
            question_id: question.id,
            agreement_id: agreement.id,
            user_id: "00000000-0000-4000-8000-000000000402",
            is_published: Math.random() < 0.75,
          };
      }
    });

    global.spinner.start(`Generating answers references...`);

    const answerIds = await knex("api.answers")
      .returning("id")
      .insert(answers);

    const answersReferences = answerIds.reduce(
      (prev, answerId) => [...prev, ...getRandomAnswerReferences(answerId)],
      [],
    );

    await knex("api.answers_references").insert(answersReferences);
  }

  global.spinner.succeed(`Answers generated.`);
};
