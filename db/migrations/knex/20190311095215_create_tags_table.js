const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190311095215_create_tags_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190311095215_create_tags_table").down());
};
