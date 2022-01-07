-------------------------------------- UP --------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- JWT START
-- https://github.com/michelp/pgjwt/blob/master/pgjwt--0.1.0.sql

CREATE OR REPLACE FUNCTION url_encode(data bytea)
  RETURNS text LANGUAGE sql AS $$
  SELECT translate(encode(data, 'base64'), E'+/=\n', '-_');
$$;

CREATE OR REPLACE FUNCTION url_decode(data text) RETURNS bytea LANGUAGE sql AS $$
  WITH
    t AS (SELECT translate(data, '-_', '+/') AS trans),
    rem AS (SELECT length(t.trans) % 4 AS remainder FROM t) -- compute padding size
  SELECT decode(
    t.trans ||
    CASE
      WHEN rem.remainder > 0
      THEN repeat('=', (4 - rem.remainder))
      ELSE '' END,
  'base64') FROM t, rem;
$$;

CREATE OR REPLACE FUNCTION algorithm_sign(signables text, secret text, algorithm text)
  RETURNS text LANGUAGE sql AS $$
  WITH
    alg AS (
      SELECT CASE
        WHEN algorithm = 'HS256' THEN 'sha256'
        WHEN algorithm = 'HS384' THEN 'sha384'
        WHEN algorithm = 'HS512' THEN 'sha512'
        ELSE '' END AS id
    ) -- hmac throws error
  SELECT url_encode(hmac(signables, secret, alg.id)) FROM alg;
$$;

CREATE OR REPLACE FUNCTION sign(payload json, secret text, algorithm text DEFAULT 'HS256')
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
  SELECT signables.data || '.' || algorithm_sign(signables.data, secret, algorithm) FROM signables;
$$;

CREATE OR REPLACE FUNCTION verify(token text, secret text, algorithm text DEFAULT 'HS256')
  RETURNS table(header json, payload json, valid boolean) LANGUAGE sql AS $$
  SELECT
    convert_from(url_decode(r[1]), 'utf8')::json AS header,
    convert_from(url_decode(r[2]), 'utf8')::json AS payload,
    r[3] = algorithm_sign(r[1] || '.' || r[2], secret, algorithm) AS valid
  FROM regexp_split_to_array(token, '\.') r;
$$;

-- JWT END

CREATE TYPE auth.jwt_token AS (token text);

/*
  * Attempt to find a "role" field value within the "auth.users" table for the
  * given "email" and "password" values.
*/
CREATE FUNCTION
  auth.user_role(email text, password text) RETURNS name AS $$
  BEGIN
    RETURN (
      SELECT ROLE FROM auth.users
      WHERE users.email = user_role.email
      AND users.password = crypt(user_role.password, users.password)
    );
  END
  $$ LANGUAGE plpgsql;

/*
  Attempt to login the user matching this email and password and return a JWT
  valid for 1h if the user is found.
*/
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

    -- Select the user id & location name from the logged user and assign it to
    -- _user_id & _location_name record variables.
    -- https://www.postgresql.org/docs/11/plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW
    SELECT u.id, u.name, l.name INTO _user_id, _user_name, _location_name
    FROM auth.users u
    INNER JOIN api.locations l ON u.location_id = l.id
    WHERE u.email = login.email;

    -- Generate the JWT token and return it as a within a stringified JSON
    -- object with these properties: role, id, email & location_id.
    SELECT sign(row_to_json(r), current_setting('app.jwt_secret')) AS token
    FROM (
      SELECT
        _role AS role,
        _user_id AS id,
        _user_name AS name,
        _location_name AS location,
        -- Set the JWT expiration date to 30 days from now:
        extract(epoch FROM now())::integer + 2592000 AS exp
    ) r
    INTO _result;

    RETURN _result;
  END
  $$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION api.login TO anonymous;

------------------------------------- DOWN -------------------------------------

DROP FUNCTION api.login;
DROP FUNCTION auth.user_role;

DROP TYPE auth.jwt_token;

DROP EXTENSION pgjwt;
DROP EXTENSION pgcrypto;
