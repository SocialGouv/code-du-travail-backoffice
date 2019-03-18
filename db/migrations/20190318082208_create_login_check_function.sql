-------------------------------------- UP --------------------------------------

CREATE TYPE login_check_result AS (header json, payload json, valid boolean);

/*
  Check a JWT and returns 3 fields:
  - header: algo & type
  - payload: token public data
  - valid: is this token valid?
*/
CREATE FUNCTION
  api.login_check(token text) RETURNS login_check_result AS $$
  DECLARE
    _result login_check_result;
  BEGIN
    SELECT * INTO _result
    FROM public.verify(token, current_setting('app.jwt_secret'));

    RETURN _result;
  END
  $$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION api.login_check TO anonymous;

------------------------------------- DOWN -------------------------------------

DROP FUNCTION api.login_check;

DROP TYPE login_check_result;
