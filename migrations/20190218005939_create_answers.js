exports.up = async knex => {
  await knex.schema.withSchema('api').createTable('answers', table => {
    table.uuid('id').primary()
    table.text('value')
    table.timestamps()

    table.uuid('question_id')
    table.foreign('question_id').references('id').on('api.questions')
  })
}

exports.down = async knex => {
  await knex.schema.withSchema('api').dropTable('answers')
}
