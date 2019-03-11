-------------------------------------- UP --------------------------------------

CREATE FUNCTION set_user()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.user_id = current_setting('request.jwt.claim.id', true)::uuid;

    RETURN NEW;
  END
  $$ LANGUAGE plpgsql;

------------------------------------- DOWN -------------------------------------

DROP FUNCTION set_user;
