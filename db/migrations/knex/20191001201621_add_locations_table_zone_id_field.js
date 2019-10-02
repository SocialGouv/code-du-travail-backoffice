const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20191001201621_add_locations_table_zone_id_field").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20191001201621_add_locations_table_zone_id_field").down());
};
