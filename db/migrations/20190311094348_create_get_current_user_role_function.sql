-------------------------------------- UP --------------------------------------

/*
  Get current authenticated user role.
*/
CREATE FUNCTION
get_current_user_role() RETURNS name AS $$
DECLARE
  _current_user_id uuid := current_setting('request.jwt.claim.id', true)::uuid;
  _current_user_role name;
BEGIN
  SELECT role INTO _current_user_role
  FROM auth.users
  WHERE auth.users.id = _current_user_id;

  RETURN _current_user_role;
END
$$ LANGUAGE plpgsql;

------------------------------------- DOWN -------------------------------------

DROP FUNCTION get_current_user_role;
