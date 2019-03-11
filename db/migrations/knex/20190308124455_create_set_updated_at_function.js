const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190308124455_create_set_updated_at_function").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190308124455_create_set_updated_at_function").down());
};
