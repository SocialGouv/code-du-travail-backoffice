const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190311094552_create_set_user").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190311094552_create_set_user").down());
};
