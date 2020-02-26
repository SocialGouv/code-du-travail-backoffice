const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(
    getMigrationQuery("20190418101832_add_answers_table_generic_reference_field").up(),
  );
};

exports.down = async knex => {
  await knex.raw(
    getMigrationQuery("20190418101832_add_answers_table_generic_reference_field").down(),
  );
};
