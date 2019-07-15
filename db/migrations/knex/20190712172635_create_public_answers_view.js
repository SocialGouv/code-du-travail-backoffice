const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190712172635_create_public_answers_view").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190712172635_create_public_answers_view").down());
};
