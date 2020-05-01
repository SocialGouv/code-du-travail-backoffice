const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200430032517_switch_full_answers_view_to_left_join").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200430032517_switch_full_answers_view_to_left_join").down());
};
