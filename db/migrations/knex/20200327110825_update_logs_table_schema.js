const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200327110825_update_logs_table_schema").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200327110825_update_logs_table_schema").down());
};
