exports.up = async knex => {
  await knex.schema.withSchema('api').createTable('locations', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.string('name').notNullable().unique()
    table.timestamps(true, true)

    table.uuid('parent_id')
    table.foreign('parent_id').references('id').on('api.locations')
  })

  // Anonymous users need access to this table to use the later on login()
  // function which generate a JWT containing the location name.
  await knex.raw('GRANT SELECT ON api.locations TO anonymous')
  await knex.raw('GRANT SELECT ON api.locations TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.locations TO administrator')

  await knex.schema.createTable('locations_agreements', table => {
    table.increments()

    table.uuid('location_id')
    table.foreign('location_id').references('id').on('api.locations')

    table.uuid('agreement_id')
    table.foreign('agreement_id').references('id').on('api.agreements')
  })

  await knex.raw('GRANT SELECT ON locations_agreements TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON locations_agreements TO administrator')
  await knex.raw('GRANT USAGE, SELECT ON SEQUENCE locations_agreements_id_seq TO administrator')
}

exports.down = async knex => {
  await knex.raw('REVOKE USAGE, SELECT ON SEQUENCE locations_agreements_id_seq FROM administrator')
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON locations_agreements FROM administrator')
  await knex.raw('REVOKE SELECT ON locations_agreements FROM contributor')

  await knex.schema.dropTable('locations_agreements')

  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.locations FROM administrator')
  await knex.raw('REVOKE SELECT ON api.locations FROM contributor')
  await knex.raw('REVOKE SELECT ON api.locations FROM anonymous')

  await knex.schema.withSchema('api').dropTable('locations')
}
