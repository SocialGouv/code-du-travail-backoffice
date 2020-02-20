const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200204158587_create_references_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200204158587_create_references_table").down());
};
