const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190308125638_create_locations_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190308125638_create_locations_table").down());
};
