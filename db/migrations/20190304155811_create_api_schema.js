exports.up = async knex => {
  await knex.raw('CREATE SCHEMA api')
}

exports.down = async knex => {
  await knex.raw('DROP SCHEMA api')
}
