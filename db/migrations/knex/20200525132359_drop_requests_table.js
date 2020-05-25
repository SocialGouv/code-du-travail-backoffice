const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200525132359_drop_requests_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200525132359_drop_requests_table").down());
};
