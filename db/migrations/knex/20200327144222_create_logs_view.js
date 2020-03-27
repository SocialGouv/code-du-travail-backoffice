const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200327144222_create_logs_view").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200327144222_create_logs_view").down());
};
