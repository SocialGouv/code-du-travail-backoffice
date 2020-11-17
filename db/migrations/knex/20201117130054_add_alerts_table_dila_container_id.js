const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20201117130054_add_alerts_table_dila_container_id").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20201117130054_add_alerts_table_dila_container_id").down());
};
