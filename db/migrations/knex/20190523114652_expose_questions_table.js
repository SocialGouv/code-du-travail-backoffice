const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190523114652_expose_questions_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190523114652_expose_questions_table").down());
};
