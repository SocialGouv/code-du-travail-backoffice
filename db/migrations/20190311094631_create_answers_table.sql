-------------------------------------- UP --------------------------------------

CREATE TABLE api.answers(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  value text NOT NULL,
  is_draft boolean DEFAULT TRUE,
  is_published boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  parent_id uuid REFERENCES api.answers(id),
  question_id uuid NOT NULL REFERENCES api.questions(id),
  agreement_id uuid REFERENCES api.agreements(id),
  -- Contributor id (updated once a contributor starts updating an answer):
  user_id uuid REFERENCES auth.users(id)
);

CREATE TRIGGER update_user_id
  BEFORE UPDATE ON api.answers
  FOR EACH ROW
  EXECUTE PROCEDURE set_user();

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.answers
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

/*
  Check if the current user is allowed to update this answer entry or relation
  entry by checking his allowed agreements (idcc) scope.
*/
CREATE FUNCTION
  check_user_can_update_answer() RETURNS TRIGGER AS $$
  DECLARE
    _agreement_id uuid;
    _answer_id uuid;
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

    IF (TG_TABLE_NAME = 'answers') THEN
      _agreement_id := _record.agreement_id;
      _answer_id := _record.id;
    ELSE
      SELECT agreement_id INTO _agreement_id
      FROM answers
      WHERE id = _record.answer_id;

      _answer_id := _record.answer_id;
    END IF;

    IF NOT (_agreement_id = ANY(get_current_user_agreements())) THEN
      -- http://postgrest.org/en/latest/api.html#http-status-codes
      -- https://www.postgresql.org/docs/11/errcodes-appendix.html
      RAISE insufficient_privilege
      USING MESSAGE = 'User "' || user_id || '" is not allowed to update answer "' || _answer_id || '".';

      RETURN null;
    END IF;

    RETURN _record;
  END
  $$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER ensure_user_can_update_answer
  AFTER UPDATE ON api.answers
  FOR EACH ROW
  EXECUTE PROCEDURE check_user_can_update_answer();

GRANT SELECT, UPDATE ON api.answers TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.answers;
DROP FUNCTION check_user_can_update_answer;
