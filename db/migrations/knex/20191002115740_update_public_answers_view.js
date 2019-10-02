const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20191002115740_update_public_answers_view").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20191002115740_update_public_answers_view").down());
};
