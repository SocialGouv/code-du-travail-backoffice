const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20210317232353_drop_answers_is_published_field").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20210317232353_drop_answers_is_published_field").down());
};
