-------------------------------------- UP --------------------------------------

CREATE TABLE api.requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  url text NOT NULL,
  is_valid boolean NOT NULL,
  relevance smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  parent_id uuid REFERENCES api.requests(id)
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.requests
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT ON api.requests TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.requests;
