-------------------------------------- UP --------------------------------------

DROP TRIGGER update_user_id ON api.answers;
DROP FUNCTION set_user;

------------------------------------- DOWN -------------------------------------

CREATE FUNCTION set_user()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.user_id = current_setting('request.jwt.claim.id', true)::uuid;

    RETURN NEW;
  END
  $$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_id
  BEFORE UPDATE ON api.answers
  FOR EACH ROW
  EXECUTE PROCEDURE set_user();

