const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200124115622_create_logs_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200124115622_create_logs_table").down());
};
