// https://github.com/michelp/pgjwt
// http://postgrest.org/en/v5.2/auth.html#logins
exports.up = async knex => {
  await knex.raw(`CREATE TYPE basic_auth.jwt_token AS (token text)`)

  await knex.raw(`
    CREATE OR REPLACE FUNCTION
    url_encode(data bytea) RETURNS text LANGUAGE sql AS $$
      SELECT translate(encode(data, 'base64'), E'+/=\n', '-_');
    $$
  `)

  await knex.raw(`
    CREATE OR REPLACE FUNCTION
    url_decode(data text) RETURNS bytea LANGUAGE sql AS $$
    WITH t AS (SELECT translate(data, '-_', '+/') AS trans),
      rem AS (SELECT length(t.trans) % 4 AS remainder FROM t) -- compute padding size
      SELECT decode(
        t.trans ||
        CASE WHEN rem.remainder > 0
          THEN repeat('=', (4 - rem.remainder))
          ELSE '' END,
      'base64') FROM t, rem;
    $$
  `)

  await knex.raw(`
    CREATE OR REPLACE FUNCTION
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

  await knex.raw(`
    CREATE OR REPLACE FUNCTION
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

  await knex.raw(`
    CREATE OR REPLACE FUNCTION
    verify(token text, secret text, algorithm text DEFAULT 'HS256')
    RETURNS table(header json, payload json, valid boolean) LANGUAGE sql AS $$
      SELECT
        convert_from(url_decode(r[1]), 'utf8')::json AS header,
        convert_from(url_decode(r[2]), 'utf8')::json AS payload,
        r[3] = algorithm_sign(r[1] || '.' || r[2], secret, algorithm) AS valid
      FROM regexp_split_to_array(token, '\.') r;
    $$
  `)

  await knex.raw(`
    CREATE OR REPLACE FUNCTION
    api.login(email text, password text) RETURNS basic_auth.jwt_token AS $$
    DECLARE
      _role name;
      result basic_auth.jwt_token;
    BEGIN
      -- Check email and password
      SELECT basic_auth.user_role(email, password) INTO _role;
      IF _role IS NULL THEN
        RAISE invalid_password USING MESSAGE = 'Invalid email and/or password.';
      END IF;

      SELECT sign(row_to_json(r), '${process.env.POSTGREST_SECRET}') AS token
        FROM (
          SELECT _role AS role, login.email AS email,
            extract(epoch FROM now())::integer + 60*60 AS exp
        ) r
        INTO result;
      RETURN result;
    END;
    $$ language plpgsql
  `)

  await knex.raw('GRANT EXECUTE ON FUNCTION api.login TO anonymous')
}

exports.down = async knex => {
  await knex.raw('REVOKE EXECUTE ON FUNCTION api.login FROM anonymous')

  await knex.raw('DROP FUNCTION algorithm_sign')
  await knex.raw('DROP FUNCTION sign(json, text, text)')
  await knex.raw('DROP FUNCTION url_decode')
  await knex.raw('DROP FUNCTION url_encode')
  await knex.raw('DROP FUNCTION verify')

  await knex.raw('DROP FUNCTION api.login')

  await knex.raw('DROP TYPE basic_auth.jwt_token')
}
