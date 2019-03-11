-------------------------------------- UP --------------------------------------

CREATE TABLE api.locations(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(255) UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.locations
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

-- Anonymous users need access to this table to use the later on login()
-- function which generate a JWT containing the location name.
GRANT SELECT ON api.locations TO anonymous;
GRANT SELECT ON api.locations TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.locations TO administrator;

CREATE TABLE api.locations_agreements(
  id serial PRIMARY KEY,

  location_id uuid NOT NULL REFERENCES api.locations(id),
  agreement_id uuid NOT NULL REFERENCES api.agreements(id)
);

GRANT SELECT ON api.locations_agreements TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.locations_agreements TO administrator;
GRANT USAGE, SELECT ON SEQUENCE api.locations_agreements_id_seq TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.locations_agreements;
DROP TABLE api.locations;
