const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190310170113_create_auth_schema").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190310170113_create_auth_schema").down());
};
