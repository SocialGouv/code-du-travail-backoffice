const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190522153135_expose_agreements_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190522153135_expose_agreements_table").down());
};
