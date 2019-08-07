const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190806153830_create_generic_answers_view").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190806153830_create_generic_answers_view").down());
};
