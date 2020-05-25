const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200525132301_drop_definitions_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200525132301_drop_definitions_table").down());
};
