const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190311102959_create_answers_references_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190311102959_create_answers_references_table").down());
};
