exports.up = async knex => {
  await knex.raw('CREATE SCHEMA auth')

  // Anonymous users need access to this schema to use the later on login()
  // function. This schema is not exposed by PostgREST since only the "api"
  // schema is.
  await knex.raw('GRANT USAGE ON SCHEMA auth TO anonymous')
  await knex.raw('GRANT USAGE ON SCHEMA auth TO contributor')
}

exports.down = async knex => {
  await knex.raw('REVOKE USAGE ON SCHEMA auth FROM contributor')
  await knex.raw('REVOKE USAGE ON SCHEMA auth FROM anonymous')

  await knex.raw('DROP SCHEMA auth')
}
