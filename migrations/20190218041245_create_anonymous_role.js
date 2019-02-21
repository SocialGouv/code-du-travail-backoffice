exports.up = async knex => {
  await knex.raw('CREATE ROLE anonymous NOLOGIN')
  await knex.raw('GRANT USAGE ON SCHEMA api TO anonymous')
  await knex.raw('GRANT SELECT ON api.answers TO anonymous')
  await knex.raw('GRANT SELECT ON api.questions TO anonymous')
}

exports.down = async knex => {
  await knex.raw('REVOKE SELECT ON api.answers FROM anonymous')
  await knex.raw('REVOKE SELECT ON api.questions FROM anonymous')
  await knex.raw('REVOKE USAGE ON SCHEMA api FROM anonymous')
  await knex.raw('DROP ROLE anonymous')
}
