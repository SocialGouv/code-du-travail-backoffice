-------------------------------------- UP --------------------------------------

CREATE EXTENSION "uuid-ossp";

CREATE TABLE api.agreements(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  idcc char(4) UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.agreements
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT ON api.agreements TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.agreements TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.agreements;

DROP EXTENSION "uuid-ossp";
