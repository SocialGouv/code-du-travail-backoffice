const axios = require("axios");
const ora = require("ora");

global.axios = axios.create({
  baseURL: "https://contributions-api.codedutravail.num.social.gouv.fr"
});

global.spinner = ora({
  discardStdin: false
});

exports.seed = async knex => {
  global.spinner.start(`Emptying tables...`);

  global.spinner.start(`Emptying tables: api.answers_comments`);
  await knex("api.answers_comments").del();
  global.spinner.start(`Emptying tables: api.answers_references`);
  await knex("api.answers_references").del();
  global.spinner.start(`Emptying tables: api.answers_tags`);
  await knex("api.answers_tags").del();
  global.spinner.start(`Emptying tables: api.questions_tags`);
  await knex("api.questions_tags").del();
  global.spinner.start(`Emptying tables: api.tags`);
  await knex("api.tags").del();
  global.spinner.start(`Emptying tables: api.tags_categories`);
  await knex("api.tags_categories").del();
  global.spinner.start(`Emptying tables: api.answers`);
  await knex("api.answers").del();
  global.spinner.start(`Emptying tables: api.questions`);
  await knex("api.questions").del();
  global.spinner.start(`Emptying tables: users_agreements`);
  await knex("users_agreements").del();
  global.spinner.start(`Emptying tables: auth.users`);
  await knex("auth.users").del();
  global.spinner.start(`Emptying tables: api.locations_agreements`);
  await knex("api.locations_agreements").del();
  global.spinner.start(`Emptying tables: api.locations`);
  await knex("api.locations").del();
  global.spinner.start(`Emptying tables: api.agreements_zones`);
  await knex("api.agreements_zones").del();
  global.spinner.start(`Emptying tables: api.agreements`);
  await knex("api.agreements").del();
  global.spinner.start(`Emptying tables: api.zones`);
  await knex("api.zones").del();

  global.spinner.succeed(`Tables emptied.`);
};
