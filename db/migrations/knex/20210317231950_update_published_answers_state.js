const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20210317231950_update_published_answers_state").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20210317231950_update_published_answers_state").down());
};
