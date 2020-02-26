const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(
    getMigrationQuery("20190311094407_create_get_current_user_agreements_function").up(),
  );
};

exports.down = async knex => {
  await knex.raw(
    getMigrationQuery("20190311094407_create_get_current_user_agreements_function").down(),
  );
};
