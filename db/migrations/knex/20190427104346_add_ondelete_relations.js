const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190427104346_add_ondelete_relations").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190427104346_add_ondelete_relations").down());
};
