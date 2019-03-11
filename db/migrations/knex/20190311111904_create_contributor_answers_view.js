const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190311111904_create_contributor_answers_view").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190311111904_create_contributor_answers_view").down());
};
