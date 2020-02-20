const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200217142934_create_definitions_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200217142934_create_definitions_table").down());
};
