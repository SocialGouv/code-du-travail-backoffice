// http://postgrest.org/en/v5.2/auth.html#sql-user-management
exports.up = async knex => {
  await knex.raw('CREATE ROLE administrator NOINHERIT')
  await knex.raw('CREATE ROLE contributor NOINHERIT')
  await knex.raw('CREATE ROLE validator NOINHERIT')
  await knex.raw('GRANT anonymous TO administrator')
  await knex.raw('GRANT anonymous TO contributor')
  await knex.raw('GRANT anonymous TO validator')

  await knex.raw('CREATE SCHEMA basic_auth')
  await knex.raw('GRANT USAGE ON SCHEMA public, basic_auth TO anonymous')

  await knex.raw(`
    CREATE TABLE
    basic_auth.users (
      email     text UNIQUE CHECK (email ~* '^.+@.+\..+$'),
      password  text NOT NULL,
      role      name NOT NULL
    )
  `)
  await knex.schema.withSchema('basic_auth').alterTable('users', table => {
    table.uuid('id').primary()
    table.timestamps()

    table.uuid('location_id')
    table.foreign('location_id').references('id').on('api.locations')
  })

  await knex.raw(`
    CREATE OR REPLACE FUNCTION
    basic_auth.check_role_exists() RETURNS TRIGGER AS $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles AS r WHERE r.rolname = new.role) THEN
        RAISE foreign_key_violation USING MESSAGE = 'Unknown database role: ' || new.role || '.';

        RETURN null;
      END IF;

      RETURN new;
    END
    $$ language plpgsql
  `)

  await knex.raw(`DROP TRIGGER IF EXISTS ensure_user_role_exists ON basic_auth.users`)
  await knex.raw(`
    CREATE CONSTRAINT TRIGGER ensure_user_role_exists
      AFTER INSERT OR UPDATE ON basic_auth.users
      FOR EACH ROW
      EXECUTE PROCEDURE basic_auth.check_role_exists()
  `)

  await knex.raw(`CREATE EXTENSION IF NOT EXISTS pgcrypto`)
  await knex.raw(`
    CREATE OR REPLACE FUNCTION
    basic_auth.encrypt_password() RETURNS TRIGGER AS $$
    BEGIN
      IF tg_op = 'INSERT' OR new.password <> old.password THEN
        new.password = crypt(new.password, gen_salt('bf'));
      END IF;

      RETURN new;
    END
    $$ language plpgsql
  `)

  await knex.raw(`DROP TRIGGER IF EXISTS encrypt_password ON basic_auth.users`)
  await knex.raw(`
    CREATE TRIGGER encrypt_password
      BEFORE INSERT OR UPDATE ON basic_auth.users
      FOR EACH ROW
      EXECUTE PROCEDURE basic_auth.encrypt_password()
  `)

  await knex.raw(`
    CREATE OR REPLACE FUNCTION
    basic_auth.user_role(email text, password text) RETURNS name LANGUAGE plpgsql AS $$
    BEGIN
      RETURN (
        SELECT ROLE FROM basic_auth.users
        WHERE users.email = user_role.email
        AND users.password = crypt(user_role.password, users.password)
      );
    END;
    $$
  `)

  await knex.raw('GRANT SELECT ON TABLE pg_authid, basic_auth.users TO anonymous')

  await knex.schema.withSchema('api').alterTable('answers', table => {
    table.uuid('user_id')
    table.foreign('user_id').references('id').on('basic_auth.users')
  })
  await knex.schema.withSchema('api').alterTable('questions', table => {
    table.uuid('user_id')
    table.foreign('user_id').references('id').on('basic_auth.users')
  })
}

exports.down = async knex => {
  await knex.schema.withSchema('api').alterTable('answers', table => {
    table.dropColumn('user_id')
  })
  await knex.schema.withSchema('api').alterTable('questions', table => {
    table.dropColumn('user_id')
  })

  // Revoke anonymous usages
  await knex.raw('REVOKE SELECT ON TABLE pg_authid, basic_auth.users FROM anonymous')
  await knex.raw('REVOKE USAGE ON SCHEMA basic_auth, public FROM anonymous')

  // Drop triggers
  await knex.raw('DROP TRIGGER encrypt_password ON basic_auth.users')
  await knex.raw('DROP TRIGGER ensure_user_role_exists ON basic_auth.users')
  // Drop users table
  await knex.schema.withSchema('basic_auth').dropTable('users')
  // Drop functions
  await knex.raw('DROP FUNCTION basic_auth.check_role_exists')
  await knex.raw('DROP FUNCTION basic_auth.encrypt_password')
  await knex.raw('DROP FUNCTION basic_auth.user_role')
  // Drop users schema
  await knex.raw('DROP SCHEMA basic_auth')

  await knex.raw('DROP ROLE administrator')
  await knex.raw('DROP ROLE contributor')
  await knex.raw('DROP ROLE validator')

}
