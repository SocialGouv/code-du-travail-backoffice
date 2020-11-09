const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20201109102911_create_alerts_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20201109102911_create_alerts_table").down());
};
