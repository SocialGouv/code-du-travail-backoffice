const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190617153413_create_answers_comments_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190617153413_create_answers_comments_table").down());
};
