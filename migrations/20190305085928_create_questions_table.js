exports.up = async knex => {
  await knex.schema.withSchema('api').createTable('questions', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.text('value').notNullable().unique()
    table.timestamps(true, true)
  })

  await knex.raw('GRANT SELECT ON api.questions TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.questions TO administrator')
}

exports.down = async knex => {
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.questions FROM administrator')
  await knex.raw('REVOKE SELECT ON api.questions FROM contributor')

  await knex.schema.withSchema('api').dropTable('questions')
}
