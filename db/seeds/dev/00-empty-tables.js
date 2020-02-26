const axios = require("axios");
const ora = require("ora");
const postgrester = require("postgrester");

global.axios = axios.create({
  baseURL: "https://contributions-api.codedutravail.fabrique.social.gouv.fr",
});

global.postgresterClient = postgrester.create({
  axiosConfig: {
    baseURL: "https://contributions-api.codedutravail.fabrique.social.gouv.fr",
  },
});

global.spinner = ora({
  discardStdin: false,
});

exports.seed = async knex => {
  global.spinner.start(`Emptying tables...`);

  global.spinner.start(`Emptying tables: api.answers_comments`);
  await knex("api.answers_comments").del();
  global.spinner.start(`Emptying tables: api.answers_references`);
  await knex("api.answers_references").del();
  global.spinner.start(`Emptying tables: api.answers`);
  await knex("api.answers").del();
  global.spinner.start(`Emptying tables: api.questions`);
  await knex("api.questions").del();

  global.spinner.start(`Emptying tables: api.definitions`);
  await knex("api.logs").del();
  global.spinner.start(`Emptying tables: api.requests`);
  await knex("api.logs").del();
  global.spinner.start(`Emptying tables: api.themes`);
  await knex("api.logs").del();
  global.spinner.start(`Emptying tables: api.references`);
  await knex("api.logs").del();

  global.spinner.start(`Emptying tables: api.logs`);
  await knex("api.logs").del();

  global.spinner.start(`Emptying tables: users_agreements`);
  await knex("users_agreements").del();
  global.spinner.start(`Emptying tables: auth.users`);
  await knex("auth.users").del();

  global.spinner.start(`Emptying tables: api.locations_agreements`);
  await knex("api.locations_agreements").del();
  global.spinner.start(`Emptying tables: api.locations`);
  await knex("api.locations").del();
  global.spinner.start(`Emptying tables: api.agreements`);
  await knex("api.agreements").del();

  global.spinner.succeed(`Tables emptied.`);
};
