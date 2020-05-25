-------------------------------------- UP --------------------------------------

DROP TABLE api.requests_references;
DROP TABLE api.requests;

------------------------------------- DOWN -------------------------------------

CREATE TABLE api.requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  variations text,
  generic_answer text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  theme_id uuid REFERENCES api.themes(id) ON DELETE SET NULL ON UPDATE NO ACTION
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.requests
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON api.requests TO administrator;

CREATE TABLE api.requests_references (
  id serial PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  request_id uuid NOT NULL REFERENCES api.requests(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  reference_id uuid NOT NULL REFERENCES api.references(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.requests_references
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON api.requests_references TO administrator;
GRANT USAGE, SELECT ON SEQUENCE api.requests_references_id_seq TO administrator;
