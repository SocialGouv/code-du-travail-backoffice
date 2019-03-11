const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190310170338_create_users_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190310170338_create_users_table").down());
};
