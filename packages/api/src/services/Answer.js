// @ts-check

const knex = require("knex");

const cache = require("../helpers/cache");

const CACHE_TTL = 60 * 60; // => 1h

const { DEV_DB_PORT, NODE_ENV, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER } = process.env;
let { DB_URI } = process.env;
if (NODE_ENV !== "production") {
  DB_URI = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DEV_DB_PORT}/${POSTGRES_DB}`;
}

const knexClient = knex({
  client: "pg",
  connection: DB_URI,
});

/**
 * Get all the publishable answers from the database.
 */
async function get() {
  const cacheKey = "answers";

  // Use cache instead of require if it exists:
  const maybeCachedAnswers = cache.get(cacheKey);
  if (maybeCachedAnswers !== undefined) {
    return maybeCachedAnswers;
  }

  /** @type {Agreement.Agreement[]} */
  const agreements = await knexClient("api.agreements").select();
  /** @type {Answer.Reference[]} */
  const answersReferences = await knexClient("api.answers_references").select();
  /** @type {Question.Question[]} */
  const questions = await knexClient("api.questions").select().limit(10);

  /** @type {Answer.Answer[]} */
  const answers = await knexClient("api.answers")
    .where({
      is_published: true,
      state: "validated",
    })
    .limit(10)
    .select();

  const answersWithAgreement = answers.map(({ agreement_id, ...props }) => ({
    ...props,
    agreement: agreement_id !== null ? agreements.find(({ id }) => id === agreement_id) : null,
  }));
  const answersWithQuestion = answersWithAgreement.map(({ question_id, ...props }) => ({
    ...props,
    question: question_id !== null ? questions.find(({ id }) => id === question_id) : null,
  }));
  const answersWithReferences = answersWithQuestion.map(answer => ({
    ...answer,
    references: answersReferences.filter(({ answer_id }) => answer_id === answer.id),
  }));

  cache.set(cacheKey, answersWithReferences, CACHE_TTL);

  return answersWithReferences;
}

module.exports = {
  get,
};
