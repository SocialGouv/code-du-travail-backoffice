const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190311094631_create_answers_table").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190311094631_create_answers_table").down());
};
