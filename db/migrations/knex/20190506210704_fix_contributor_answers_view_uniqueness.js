const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190506210704_fix_contributor_answers_view_uniqueness").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190506210704_fix_contributor_answers_view_uniqueness").down());
};
