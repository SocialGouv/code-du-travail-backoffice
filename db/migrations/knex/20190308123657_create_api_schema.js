const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190308123657_create_api_schema").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190308123657_create_api_schema").down());
};
