exports.up = async knex => {
  await knex.raw('CREATE ROLE anonymous NOLOGIN')
  await knex.raw('GRANT USAGE ON SCHEMA api TO anonymous')
  await knex.raw('GRANT SELECT ON api.answers TO anonymous')
  await knex.raw('GRANT SELECT ON api.questions TO anonymous')
}

exports.down = async knex => {
  await knex.raw('DROP ROLE anonymous')
}
