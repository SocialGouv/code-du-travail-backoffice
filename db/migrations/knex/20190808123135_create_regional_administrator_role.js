const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190808123135_create_regional_administrator_role").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190808123135_create_regional_administrator_role").down());
};
