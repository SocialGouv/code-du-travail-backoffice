const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200429131055_add_logs_table_body_field").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200429131055_add_logs_table_body_field").down());
};
