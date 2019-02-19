exports.up = async knex => {
  await knex.schema.raw('ALTER TABLE api.answers ALTER COLUMN id SET DEFAULT uuid_generate_v4()')
}

exports.down = async knex => {
  await knex.schema.raw('ALTER TABLE api.answers ALTER COLUMN id DROP DEFAULT')
}
