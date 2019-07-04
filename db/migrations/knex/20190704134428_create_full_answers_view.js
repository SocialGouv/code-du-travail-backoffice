const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190704134428_create_full_answers_view").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190704134428_create_full_answers_view").down());
};
