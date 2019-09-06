const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190905093812_create_tags_categories_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190905093812_create_tags_categories_table").down());
};
