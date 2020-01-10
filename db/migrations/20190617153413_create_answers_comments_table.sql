-------------------------------------- UP --------------------------------------

CREATE TABLE api.answers_comments(
  id serial PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  answer_id uuid NOT NULL REFERENCES api.answers(id),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

CREATE FUNCTION set_user()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.user_id = current_setting('request.jwt.claim.id', true)::uuid;

    RETURN NEW;
  END
  $$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_id
  BEFORE INSERT ON api.answers_comments
  FOR EACH ROW
  EXECUTE PROCEDURE set_user();

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.answers_comments
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

CREATE CONSTRAINT TRIGGER ensure_user_can_update_answer
  AFTER UPDATE ON api.answers_comments
  FOR EACH ROW
  EXECUTE PROCEDURE check_user_can_update_answer();

/*
  Check if the current user is allowed to update this comment based on the rule
  that contributors can only update their own comments.
*/
CREATE FUNCTION
  check_user_can_update_comment() RETURNS TRIGGER AS $$
  DECLARE
    _record RECORD;
    _user_id uuid := current_setting('request.jwt.claim.id', true)::uuid;
    _user_role name;
  BEGIN
      -- https://www.postgresql.org/docs/11/plpgsql-trigger.html
    IF (TG_OP = 'DELETE') THEN
      _record := OLD;
    ELSE
      _record := NEW;
    END IF;

    IF (get_current_user_role() = 'administrator') THEN
      RETURN _record;
    END IF;

    IF NOT (_record.user_id = _user_id) THEN
      -- http://postgrest.org/en/latest/api.html#http-status-codes
      -- https://www.postgresql.org/docs/11/errcodes-appendix.html
      RAISE insufficient_privilege
      USING MESSAGE = 'User "' || user_id || '" is not allowed to update comment on answer "' || _record.answer_id || '".';

      RETURN null;
    END IF;

    RETURN _record;
  END
  $$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER ensure_user_can_update_comment
  AFTER UPDATE ON api.answers_comments
  FOR EACH ROW
  EXECUTE PROCEDURE check_user_can_update_comment();

GRANT SELECT, INSERT ON api.answers_comments TO contributor;
GRANT USAGE, SELECT ON SEQUENCE api.answers_comments_id_seq TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers_comments TO administrator;
GRANT USAGE, SELECT ON SEQUENCE api.answers_comments_id_seq TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.answers_comments;

DROP FUNCTION check_user_can_update_comment;
DROP FUNCTION set_user;
