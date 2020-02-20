const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200204161601_create_themes_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200204161601_create_themes_table").down());
};
