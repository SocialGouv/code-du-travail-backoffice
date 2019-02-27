exports.up = async knex => {
  await knex.schema.withSchema('api').createTable('tags', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('value').notNullable()
    table.enum('category', ['contract_type', 'distinctive_identity', 'target', 'theme', 'work_schedule_type', 'work_time']).notNullable()
    table.timestamps(true, true)

    table.uuid('user_id').defaultTo(knex.raw(`current_setting('request.jwt.claim.id', true)::uuid`))
    table.foreign('user_id').references('id').on('basic_auth.users')
  })

  await knex.schema.withSchema('api').createTable('questions_tags', table => {
    table.increments()

    table.uuid('question_id').notNullable()
    table.uuid('tag_id').notNullable()
    table.foreign('question_id').references('id').on('api.questions')
    table.foreign('tag_id').references('id').on('api.tags')
  })

  await knex.schema.withSchema('api').createTable('answers_tags', table => {
    table.increments()

    table.uuid('answer_id').notNullable()
    table.uuid('tag_id').notNullable()
    table.foreign('answer_id').references('id').on('api.answers')
    table.foreign('tag_id').references('id').on('api.tags')
  })

  await knex.raw('GRANT SELECT ON api.tags TO anonymous')
  await knex.raw('GRANT SELECT ON api.questions_tags TO anonymous')
  await knex.raw('GRANT SELECT ON api.answers_tags TO anonymous')

  await knex.raw('GRANT SELECT ON api.tags TO contributor')
  await knex.raw('GRANT SELECT ON api.questions_tags TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers_tags TO contributor')
  await knex.raw('GRANT USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq TO contributor')

  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.tags TO administrator')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.questions_tags TO administrator')
  await knex.raw('GRANT USAGE, SELECT ON SEQUENCE api.questions_tags_id_seq TO administrator')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers_tags TO administrator')
  await knex.raw('GRANT USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq TO administrator')
}

exports.down = async knex => {
  await knex.raw('REVOKE SELECT ON api.tags FROM anonymous')
  await knex.raw('REVOKE SELECT ON api.questions_tags FROM anonymous')
  await knex.raw('REVOKE SELECT ON api.answers_tags FROM anonymous')

  await knex.raw('REVOKE SELECT ON api.tags FROM contributor')
  await knex.raw('REVOKE SELECT ON api.questions_tags FROM contributor')
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.answers_tags FROM contributor')
  await knex.raw('REVOKE USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq FROM contributor')

  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.tags FROM administrator')
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.questions_tags FROM administrator')
  await knex.raw('REVOKE USAGE, SELECT ON SEQUENCE api.questions_tags_id_seq FROM administrator')
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.answers_tags FROM administrator')
  await knex.raw('REVOKE USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq FROM administrator')

  await knex.schema.dropTable('api.answers_tags')
  await knex.schema.dropTable('api.questions_tags')
  await knex.schema.dropTable('api.tags')
}
