const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190809083710_drop_contributor_answers_view").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190809083710_drop_contributor_answers_view").down());
};
