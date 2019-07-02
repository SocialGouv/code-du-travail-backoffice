const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190702104939_update_answer_state_type").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190702104939_update_answer_state_type").down());
};
