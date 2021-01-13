const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20201117124207_grant_alerts_table_crud_to_administator_role").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20201117124207_grant_alerts_table_crud_to_administator_role").down());
};
