const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200204164038_create_requests_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200204164038_create_requests_table").down());
};
