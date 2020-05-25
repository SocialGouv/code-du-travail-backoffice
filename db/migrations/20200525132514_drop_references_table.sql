-------------------------------------- UP --------------------------------------

DROP TABLE api.references;

------------------------------------- DOWN -------------------------------------

CREATE TABLE api.references (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  position smallint NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.references
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON api.references TO administrator;
