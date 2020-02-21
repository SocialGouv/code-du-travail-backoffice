const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200224221656_update_answers_references_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200224221656_update_answers_references_table").down());
};
