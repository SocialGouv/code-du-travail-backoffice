const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20200420092929_add_answers_references_dila_cid_field").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20200420092929_add_answers_references_dila_cid_field").down());
};
