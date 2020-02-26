const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(
    getMigrationQuery("20190722052835_add_answers_comments_table_is_private_field").up(),
  );
};

exports.down = async knex => {
  await knex.raw(
    getMigrationQuery("20190722052835_add_answers_comments_table_is_private_field").down(),
  );
};
