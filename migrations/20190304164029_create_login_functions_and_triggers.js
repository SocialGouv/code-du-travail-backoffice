/**
 * @see http://postgrest.org/en/v5.2/auth.html#sql-user-management
 * @see https://github.com/michelp/pgjwt
 * @see http://postgrest.org/en/v5.2/auth.html#logins
 *
 * TODO Replace signing functions by: https://github.com/michelp/pgjwt.
 */
exports.up = async knex => {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS pgcrypto`)

  /**
   * Attempt to find a "role" field value within the "auth.users" table for the
   * given "email" and "password" values.
   */
  await knex.raw(`
    CREATE FUNCTION
    auth.user_role(email text, password text) RETURNS name LANGUAGE plpgsql AS $$
    BEGIN
      RETURN (
        SELECT ROLE FROM auth.users
        WHERE users.email = user_role.email
        AND users.password = crypt(user_role.password, users.password)
      );
    END;
    $$
  `)

  await knex.raw(`CREATE TYPE auth.jwt_token AS (token text)`)

  /**
   * Convert a given binary "data" value into a base64 string and replace any of
   * the ["+", "/", "=", "\n"] characters by "-_".
   *
   * @see https://www.postgresql.org/docs/11/functions-string.html#FUNCTIONS-STRING-OTHER
   */
  await knex.raw(`
    CREATE FUNCTION
    url_encode(data bytea) RETURNS text LANGUAGE sql AS $$
      SELECT translate(encode(data, 'base64'), E'+/=\n', '-_');
    $$
  `)

  /**
   * Hash a string using one of the provided algorithms with the provided secret
   * key as a string.
   *
   * @see https://www.postgresql.org/docs/current/pgcrypto.html
   */
  await knex.raw(`
    CREATE FUNCTION
    algorithm_sign(signables text, secret text, algorithm text)
    RETURNS text LANGUAGE sql AS $$
    WITH
      alg AS (
        SELECT CASE
          WHEN algorithm = 'HS256' THEN 'sha256'
          WHEN algorithm = 'HS384' THEN 'sha384'
          WHEN algorithm = 'HS512' THEN 'sha512'
          ELSE '' END AS id
      )
    SELECT url_encode(hmac(signables, secret, alg.id)) FROM alg;
    $$
  `)

  /**
   * Generate a HS256-signed JSON Web Token string from a JSON payload.
   *
   * @see https://jwt.io/
   *
   * TODO Switch to HS512 once pgjwt integrated.
   */
  await knex.raw(`
    CREATE FUNCTION
    sign(payload json, secret text, algorithm text DEFAULT 'HS256')
    RETURNS text LANGUAGE sql AS $$
    WITH
      header AS (
        SELECT url_encode(convert_to('{"alg":"' || algorithm || '","typ":"JWT"}', 'utf8')) AS data
      ),
      payload AS (
        SELECT url_encode(convert_to(payload::text, 'utf8')) AS data
      ),
      signables AS (
        SELECT header.data || '.' || payload.data AS data FROM header, payload
      )
    SELECT
        signables.data || '.' ||
        algorithm_sign(signables.data, secret, algorithm) FROM signables;
    $$
  `)

  /**
   * Attempt to login the user matching this email and password and return a JWT
   * valid for 1h if the user is found.
   */
  await knex.raw(`
    CREATE FUNCTION
    api.login(email text, password text) RETURNS auth.jwt_token AS $$
    DECLARE
      _location_name varchar;
      _result auth.jwt_token;
      _role name;
      _user_id char(36);
      _user_name varchar;
    BEGIN
      -- Check user email and password
      SELECT auth.user_role(email, password) INTO _role;
      IF _role IS NULL THEN
        RAISE invalid_password USING MESSAGE = 'Invalid email and/or password.';
      END IF;

      -- Select the user id & location name from the logged user and assign it to _user_id & _location_name record variables.
      -- https://www.postgresql.org/docs/9.6/plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW
      SELECT u.id, u.name, l.name INTO _user_id, _user_name, _location_name
      FROM auth.users u
      INNER JOIN api.locations l ON u.location_id = l.id
      WHERE u.email = login.email;

      -- Generate the JWT token and return it as a within a stringified JSON object
      -- with these properties: role, id, email & location_id.
      SELECT sign(row_to_json(r), '${process.env.PGRST_JWT_SECRET}') AS token
      FROM (
        SELECT _role AS role, _user_id AS id, _user_name AS name, _location_name AS location,
        extract(epoch FROM now())::integer + 60*60 AS exp
      ) r
      INTO _result;

      RETURN _result;
    END;
    $$ language plpgsql
  `)

  await knex.raw('GRANT EXECUTE ON FUNCTION api.login TO anonymous')
}

exports.down = async knex => {
  await knex.raw('REVOKE EXECUTE ON FUNCTION api.login FROM anonymous')

  await knex.raw('DROP FUNCTION api.login')

  await knex.raw('DROP FUNCTION sign(json, text, text)')
  await knex.raw('DROP FUNCTION algorithm_sign')
  await knex.raw('DROP FUNCTION url_encode')

  await knex.raw('DROP TYPE auth.jwt_token')

  await knex.raw('DROP FUNCTION auth.user_role')

  await knex.raw('DROP EXTENSION IF EXISTS pgcrypto')
}
