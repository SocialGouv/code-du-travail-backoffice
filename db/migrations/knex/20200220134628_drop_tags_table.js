const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200220134628_drop_tags_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200220134628_drop_tags_table").down());
};
