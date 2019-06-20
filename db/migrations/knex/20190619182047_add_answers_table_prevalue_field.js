const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190619182047_add_answers_table_prevalue_field").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190619182047_add_answers_table_prevalue_field").down());
};
