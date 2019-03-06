exports.up = async knex => {
  await knex.schema.withSchema('api').createTable('answers', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.text('value').notNullable().defaultTo('')
    table.timestamps(true, true)

    table.uuid('parent_id')
    table.foreign('parent_id').references('id').on('api.answers')

    table.uuid('question_id')
    table.foreign('question_id').references('id').on('api.questions')

    table.uuid('agreement_id')
    table.foreign('agreement_id').references('id').on('api.agreements')

    table.uuid('editor_id').defaultTo(knex.raw(`current_setting('request.jwt.claim.id', true)::uuid`))
    table.foreign('editor_id').references('id').on('auth.users')
  })

  /**
   * Check if the current user is allowed to update this answer by checking his
   * agreements (idcc) scope.
   */
  await knex.raw(`
    CREATE FUNCTION
    check_user_can_update_answer() RETURNS TRIGGER AS $$
    DECLARE
      _user_id uuid := current_setting('request.jwt.claim.id', true)::uuid;
      _user_role name;
    BEGIN
      IF (get_current_user_role() = 'administrator') THEN
        RETURN NEW;
      END IF;

      IF NOT (NEW.agreement_id = ANY(get_current_user_agreements())) THEN
        -- https://postgrest.org/en/v4.1/html#http-status-codes
        -- https://www.postgresql.org/docs/current/errcodes-appendix.html
        RAISE insufficient_privilege
        USING MESSAGE = 'User "' || user_id || '" is not allowed to update answer "' || NEW.id || '".';

        RETURN null;
      END IF;

      RETURN NEW;
    END
    $$ language plpgsql
  `);

  await knex.raw(`
    CREATE CONSTRAINT TRIGGER ensure_user_can_update_answer
      AFTER UPDATE ON api.answers
      FOR EACH ROW
      EXECUTE PROCEDURE check_user_can_update_answer()
  `)

  await knex.raw('GRANT SELECT, UPDATE ON api.answers TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers TO administrator')
}

exports.down = async knex => {
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.answers FROM administrator')
  await knex.raw('REVOKE SELECT, UPDATE ON api.answers FROM contributor')

  await knex.schema.withSchema('api').dropTable('answers')

  await knex.raw('DROP FUNCTION check_user_can_update_answer')
}
