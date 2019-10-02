const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20191001223048_expose_locations_agreements_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20191001223048_expose_locations_agreements_table").down());
};
