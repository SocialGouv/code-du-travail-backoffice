exports.up = async knex => {
  await knex.schema.withSchema('api').createTable('tags', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('value').notNullable()
    table.enum('category', ['contract_type', 'distinctive_identity', 'target', 'theme', 'work_schedule_type', 'work_time']).notNullable()
    table.timestamps(true, true)
  })

  await knex.raw('GRANT SELECT ON api.tags TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.tags TO administrator')

  await knex.schema.withSchema('api').createTable('questions_tags', table => {
    table.increments()

    table.uuid('question_id').notNullable()
    table.uuid('tag_id').notNullable()
    table.foreign('question_id').references('id').on('api.questions')
    table.foreign('tag_id').references('id').on('api.tags')
  })

  await knex.raw('GRANT SELECT ON api.questions_tags TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.questions_tags TO administrator')
  await knex.raw('GRANT USAGE, SELECT ON SEQUENCE api.questions_tags_id_seq TO administrator')

  await knex.schema.withSchema('api').createTable('answers_tags', table => {
    table.increments()

    table.uuid('answer_id').notNullable()
    table.uuid('tag_id').notNullable()
    table.foreign('answer_id').references('id').on('api.answers')
    table.foreign('tag_id').references('id').on('api.tags')
  })

  await knex.raw('GRANT SELECT, INSERT, DELETE ON api.answers_tags TO contributor');
  await knex.raw('GRANT USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq TO contributor');
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers_tags TO administrator');
  await knex.raw('GRANT USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq TO administrator');

  /**
   * Check if the current user is allowed to update this answer tags by checking
   * his agreements (IDCCs) scope.
   */
  await knex.raw(`
    CREATE FUNCTION
    check_user_can_toggle_answer_tag() RETURNS TRIGGER AS $$
    DECLARE
      _agreement_id uuid;
      _record RECORD;
      _user_id uuid := current_setting('request.jwt.claim.id', true)::uuid;
      _user_role name;
    BEGIN
      -- https://www.postgresql.org/docs/current/plpgsql-trigger.html
      IF (TG_OP = 'DELETE') THEN
        _record := OLD;
      ELSE
        _record := NEW;
      END IF;

      IF (get_current_user_role() = 'administrator') THEN
        RETURN _record;
      END IF;

      SELECT agreement_id INTO _agreement_id
      FROM answers
      WHERE id = _record.answer_id;

      IF NOT (_agreement_id = ANY(get_current_user_agreements())) THEN
        -- http://postgrest.org/en/v5.2/api.html#http-status-codes
        -- https://www.postgresql.org/docs/current/errcodes-appendix.html
        RAISE insufficient_privilege
        USING MESSAGE = 'User "' || user_id || '" is not allowed to update tags for answer "' || _record.id || '".';

        RETURN null;
      END IF;

      RETURN _record;
    END
    $$ language plpgsql
  `);

  await knex.raw(`
    CREATE CONSTRAINT TRIGGER ensure_user_can_toggle_answer_tag
      AFTER INSERT OR DELETE ON api.answers_tags
      FOR EACH ROW
      EXECUTE PROCEDURE check_user_can_toggle_answer_tag()
  `);
}

exports.down = async knex => {
  await knex.raw('REVOKE USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq FROM administrator')
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.answers_tags FROM administrator')
  await knex.raw('REVOKE USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq FROM contributor')
  await knex.raw('REVOKE SELECT, INSERT, DELETE ON api.answers_tags FROM contributor')

  await knex.schema.withSchema('api').dropTable('answers_tags');

  await knex.raw('DROP FUNCTION check_user_can_toggle_answer_tag')

  await knex.raw('REVOKE USAGE, SELECT ON SEQUENCE api.questions_tags_id_seq FROM administrator')
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.questions_tags FROM administrator')
  await knex.raw("REVOKE SELECT ON api.questions_tags FROM contributor");

  await knex.schema.withSchema('api').dropTable('questions_tags');

  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.tags FROM administrator')
  await knex.raw('REVOKE SELECT ON api.tags FROM contributor')

  await knex.schema.withSchema('api').dropTable('tags')
}
