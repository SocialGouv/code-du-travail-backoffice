-------------------------------------- UP --------------------------------------

CREATE TABLE api.themes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  position smallint NOT NULL,
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  parent_id uuid REFERENCES api.themes(id)
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.themes
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT ON api.themes TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.themes;
