const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190704055828_update_login_function").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190704055828_update_login_function").down());
};
