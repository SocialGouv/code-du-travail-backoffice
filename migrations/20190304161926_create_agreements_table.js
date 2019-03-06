exports.up = async knex => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  await knex.schema.withSchema('api').createTable('agreements', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.text('name').notNullable().unique()
    table.string('idcc', 4).notNullable().unique()
    table.timestamps(true, true)
  })

  await knex.raw('GRANT SELECT ON api.agreements TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.agreements TO administrator')
}

exports.down = async knex => {
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.agreements FROM administrator')
  await knex.raw('REVOKE SELECT ON api.agreements FROM contributor')

  await knex.schema.withSchema('api').dropTable('agreements')

  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
}
