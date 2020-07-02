const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200702115742_expose_answers_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200702115742_expose_answers_table").down());
};
