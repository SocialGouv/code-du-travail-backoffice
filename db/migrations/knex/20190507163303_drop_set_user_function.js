const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190507163303_drop_set_user_function").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190507163303_drop_set_user_function").down());
};
