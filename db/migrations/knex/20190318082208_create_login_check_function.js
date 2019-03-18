const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190318082208_create_login_check_function").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190318082208_create_login_check_function").down());
};
