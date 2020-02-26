const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200226050422_add_answers_references_table_is_skipped_field").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200226050422_add_answers_references_table_is_skipped_field").down());
};
