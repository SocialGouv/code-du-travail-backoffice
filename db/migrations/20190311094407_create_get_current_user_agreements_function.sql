-------------------------------------- UP --------------------------------------

/*
  Get current authenticated user agreements scope.
*/
CREATE FUNCTION
get_current_user_agreements() RETURNS uuid[] AS $$
DECLARE
  _current_user_agreements uuid[];
  _current_user_id uuid := current_setting('request.jwt.claim.id', true)::uuid;
BEGIN
  SELECT array_agg(agreement_id) INTO _current_user_agreements
  FROM (
    SELECT agreement_id
    FROM users_agreements
    WHERE user_id = _current_user_id
  ) AS r;

  RETURN _current_user_agreements;
END
$$ LANGUAGE plpgsql;

------------------------------------- DOWN -------------------------------------

DROP FUNCTION get_current_user_agreements;
