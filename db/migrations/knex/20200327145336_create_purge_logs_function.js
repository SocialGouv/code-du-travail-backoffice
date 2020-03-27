const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200327145336_create_purge_logs_function").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200327145336_create_purge_logs_function").down());
};
