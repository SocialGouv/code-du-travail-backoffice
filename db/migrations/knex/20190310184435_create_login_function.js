const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190310184435_create_login_function").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190310184435_create_login_function").down());
};
