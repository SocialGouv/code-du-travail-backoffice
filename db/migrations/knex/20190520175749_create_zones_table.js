const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190520175749_create_zones_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190520175749_create_zones_table").down());
};
