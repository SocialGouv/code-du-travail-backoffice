-------------------------------------- UP --------------------------------------

CREATE TABLE api.answers_references(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  value text NOT NULL,
  url text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  answer_id uuid NOT NULL REFERENCES api.answers(id)
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.answers_references
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

CREATE CONSTRAINT TRIGGER ensure_user_can_update_answer
  AFTER UPDATE ON api.answers_references
  FOR EACH ROW
  EXECUTE PROCEDURE check_user_can_update_answer();

GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers_references TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers_references TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.answers_references;
