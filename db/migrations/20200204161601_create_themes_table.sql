-------------------------------------- UP --------------------------------------

CREATE TABLE api.themes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  position smallint NOT NULL,
  title text NOT NULL,
  subtitle text,
  introduction text,
  variations text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  parent_id uuid REFERENCES api.themes(id) ON DELETE SET NULL ON UPDATE NO ACTION
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.themes
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON api.themes TO administrator;

CREATE TABLE api.themes_references (
  id serial PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  theme_id uuid NOT NULL REFERENCES api.themes(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  reference_id uuid NOT NULL REFERENCES api.references(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.themes_references
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON api.themes_references TO administrator;
GRANT USAGE, SELECT ON SEQUENCE api.themes_references_id_seq TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.themes_references;
DROP TABLE api.themes;
