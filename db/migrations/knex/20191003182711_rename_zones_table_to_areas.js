const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20191003182711_rename_zones_table_to_areas").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20191003182711_rename_zones_table_to_areas").down());
};
