exports.up = async knex => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  await knex.schema.withSchema('api').createTable('questions', table => {
    table.uuid('id').primary()
    table.text('value').unique()
    table.timestamps()
  })
}

exports.down = async knex => {
  await knex.schema.withSchema('api').dropTable('questions')

  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
}
