const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("20190503073735_update_answer_reference_category_type").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("20190503073735_update_answer_reference_category_type").down());
};
