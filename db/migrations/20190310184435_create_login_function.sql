-------------------------------------- UP --------------------------------------

CREATE EXTENSION pgcrypto;

-- JWT extension
-- https://github.com/michelp/pgjwt
CREATE EXTENSION "pgjwt";

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
    -- https://www.postgresql.org/docs/current/plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW
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
