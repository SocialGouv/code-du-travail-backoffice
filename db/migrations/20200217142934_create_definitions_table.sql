-------------------------------------- UP --------------------------------------

CREATE TABLE api.definitions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  value text NOT NULL,
  abbreviations text,
  variations text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  theme_id uuid REFERENCES api.themes(id) ON DELETE SET NULL ON UPDATE NO ACTION
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.definitions
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON api.definitions TO administrator;

CREATE TABLE api.definitions_references (
  id serial PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  definition_id uuid NOT NULL REFERENCES api.definitions(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  reference_id uuid NOT NULL REFERENCES api.references(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.definitions_references
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON api.definitions_references TO administrator;
GRANT USAGE, SELECT ON SEQUENCE api.definitions_references_id_seq TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.definitions_references;
DROP TABLE api.definitions;
