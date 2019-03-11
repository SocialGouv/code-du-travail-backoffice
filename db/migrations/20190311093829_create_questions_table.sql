-------------------------------------- UP --------------------------------------

CREATE TABLE api.questions(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  value text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.questions
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT ON api.questions TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.questions TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.questions;
