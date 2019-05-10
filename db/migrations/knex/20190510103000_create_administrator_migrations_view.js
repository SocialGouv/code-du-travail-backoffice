const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190510103000_create_administrator_migrations_view").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190510103000_create_administrator_migrations_view").down());
};
