const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190322070917_create_administrator_users_view").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190322070917_create_administrator_users_view").down());
};
