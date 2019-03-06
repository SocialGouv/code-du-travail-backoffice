exports.up = async knex => {
  await knex.raw('CREATE ROLE anonymous NOINHERIT NOLOGIN')
  await knex.raw('GRANT USAGE ON SCHEMA api, public TO anonymous')

  await knex.raw('CREATE ROLE administrator NOINHERIT')
  await knex.raw('GRANT USAGE ON SCHEMA api, public TO administrator')

  await knex.raw('CREATE ROLE contributor NOINHERIT')
  await knex.raw('GRANT USAGE ON SCHEMA api, public TO contributor')
}

exports.down = async knex => {
  await knex.raw('REVOKE USAGE ON SCHEMA api, public FROM contributor')
  await knex.raw('DROP ROLE contributor')

  await knex.raw('REVOKE USAGE ON SCHEMA api, public FROM administrator')
  await knex.raw('DROP ROLE administrator')

  await knex.raw('REVOKE USAGE ON SCHEMA api, public FROM anonymous')
  await knex.raw('DROP ROLE anonymous')
}
