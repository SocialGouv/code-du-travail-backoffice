const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190507214637_add_questions_table_index_field").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190507214637_add_questions_table_index_field").down());
};
