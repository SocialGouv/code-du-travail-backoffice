const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190426091332_add_answers_table_state_field").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190426091332_add_answers_table_state_field").down());
};
