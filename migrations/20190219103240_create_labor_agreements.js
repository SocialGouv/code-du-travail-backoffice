exports.up = async knex => {
  await knex.schema.withSchema('api').createTable('labor_agreements', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('name');
    table.string('idcc', 4);
    table.timestamps(true, true);
  });
};

exports.down = async knex => {
  await knex.schema.withSchema('api').dropTable('labor_agreements');
};
