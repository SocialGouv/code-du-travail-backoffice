const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(
    getMigrationQuery("20200421092442_add_answers_references_dila_container_id_field").up(),
  );
};

exports.down = async knex => {
  await knex.raw(
    getMigrationQuery("20200421092442_add_answers_references_dila_container_id_field").down(),
  );
};
