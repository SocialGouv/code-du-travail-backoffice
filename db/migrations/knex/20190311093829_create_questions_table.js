const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190311093829_create_questions_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190311093829_create_questions_table").down());
};
