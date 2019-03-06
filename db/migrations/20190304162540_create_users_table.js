// http://postgrest.org/en/v5.2/auth.html#sql-user-management
exports.up = async knex => {
  await knex.raw(`
    CREATE TABLE
    auth.users (
      role name NOT NULL
    )
  `)
  await knex.schema.withSchema('auth').alterTable('users', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.string('name').notNullable()
    table.timestamps(true, true)

    table.uuid('location_id')
    table.foreign('location_id').references('id').on('api.locations')
  })

  /**
   * Encrypt "password" field value within a given INSERT or UPDATE using
   * "pgcrypto" extension "crypt()' and "gen_salt()" functions.
   *
   * @see https://www.postgresql.org/docs/11/pgcrypto.html
   */
  await knex.raw(`
    CREATE FUNCTION
    auth.encrypt_password() RETURNS TRIGGER AS $$
    BEGIN
      IF tg_op = 'INSERT' OR new.password <> old.password THEN
        new.password = crypt(new.password, gen_salt('bf'));
      END IF;

      RETURN new;
    END
    $$ language plpgsql
  `)

  /**
   * Trigger "password" field value encryption on any INSERT ot UPDATE within
   * "auth.users" table.
   */
  await knex.raw(`
    CREATE TRIGGER encrypt_password
      BEFORE INSERT OR UPDATE ON auth.users
      FOR EACH ROW
      EXECUTE PROCEDURE auth.encrypt_password()
  `)

  /**
   * Check if "role" field value within a given INSERT or UPDATE exists in
   * default "pg_roles" table.
   */
  await knex.raw(`
    CREATE FUNCTION
    auth.check_role_exists() RETURNS TRIGGER AS $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles AS r WHERE r.rolname = new.role) THEN
        RAISE foreign_key_violation USING MESSAGE = 'Unknown database role: ' || new.role || '.';

        RETURN null;
      END IF;

      RETURN new;
    END
    $$ language plpgsql
  `)

  /**
   * Trigger "role" field value checking function on any INSERT ot UPDATE within
   * "auth.users" table.
   */
  await knex.raw(`
    CREATE CONSTRAINT TRIGGER ensure_user_role_exists
      AFTER INSERT OR UPDATE ON auth.users
      FOR EACH ROW
      EXECUTE PROCEDURE auth.check_role_exists()
  `)

  // Anonymous users need access to this table to use the later on login()
  // function. This table is not exposed by PostgREST since only the ones under
  // "api" schema are.
  await knex.raw('GRANT SELECT ON auth.users TO anonymous')
  await knex.raw('GRANT SELECT ON auth.users TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON auth.users TO administrator')

  await knex.schema.createTable('users_agreements', table => {
    table.increments()

    table.uuid('user_id')
    table.foreign('user_id').references('id').on('auth.users')

    table.uuid('agreement_id')
    table.foreign('agreement_id').references('id').on('api.agreements')
  })

  await knex.raw('GRANT SELECT ON users_agreements TO anonymous')
  await knex.raw('GRANT SELECT ON users_agreements TO contributor')
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON users_agreements TO administrator')
  await knex.raw('GRANT USAGE, SELECT ON SEQUENCE users_agreements_id_seq TO administrator')
}

exports.down = async knex => {
  await knex.raw('REVOKE USAGE, SELECT ON SEQUENCE users_agreements_id_seq FROM administrator')
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON users_agreements FROM administrator')
  await knex.raw('REVOKE SELECT ON users_agreements FROM contributor')
  await knex.raw('REVOKE SELECT ON users_agreements FROM anonymous')

  await knex.schema.dropTable('users_agreements')

  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON auth.users FROM administrator')
  await knex.raw('REVOKE SELECT ON auth.users FROM contributor')
  await knex.raw('REVOKE SELECT ON auth.users FROM anonymous')

  await knex.schema.withSchema('auth').dropTable('users')

  await knex.raw('DROP FUNCTION auth.check_role_exists')
  await knex.raw('DROP FUNCTION auth.encrypt_password')
}
