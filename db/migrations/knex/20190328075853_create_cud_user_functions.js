const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190328075853_create_cud_user_functions").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190328075853_create_cud_user_functions").down());
};
