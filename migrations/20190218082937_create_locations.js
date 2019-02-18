exports.up = async knex => {
  await knex.schema.withSchema('api').createTable('locations', table => {
    table.uuid('id').primary()
    table.text('value').unique()
    table.timestamps()
  })

  await knex.raw('GRANT SELECT ON api.locations TO anonymous')

  await knex.schema.withSchema('api').alterTable('questions', table => {
    table.uuid('location_id')
    table.foreign('location_id').references('id').on('api.locations')
  })
}

exports.down = async knex => {
  await knex.schema.withSchema('api').alterTable('questions', table => {
    table.dropColumn('location_id')
  })

  await knex.schema.withSchema('api').dropTable('locations')
}
