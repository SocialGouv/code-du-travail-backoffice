const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200220133636_drop_areas_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200220133636_drop_areas_table").down());
};
