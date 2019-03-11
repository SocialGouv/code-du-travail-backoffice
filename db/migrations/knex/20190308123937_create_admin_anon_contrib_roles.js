const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190308123937_create_admin_anon_contrib_roles").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190308123937_create_admin_anon_contrib_roles").down());
};
