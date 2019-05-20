-------------------------------------- UP --------------------------------------

CREATE TYPE zone_category AS ENUM (
  'department',
  'overseas_collectivity',
  'region',
  'sui_generis_collectivity'
);

CREATE TABLE api.zones(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  category zone_category NOT NULL,
  code varchar(5) UNIQUE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  parent_id uuid REFERENCES api.zones(id)
);

GRANT SELECT, INSERT, UPDATE ON api.zones TO administrator;
GRANT SELECT ON api.zones TO anonymous;
GRANT SELECT ON api.zones TO contributor;

CREATE TABLE api.agreements_zones(
  id serial PRIMARY KEY,

  agreement_id uuid NOT NULL REFERENCES api.agreements(id),
  zone_id uuid NOT NULL REFERENCES api.zones(id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON api.agreements_zones TO administrator;
GRANT USAGE, SELECT ON SEQUENCE api.agreements_zones_id_seq TO administrator;
GRANT SELECT ON api.agreements_zones TO anonymous;
GRANT SELECT ON api.agreements_zones TO contributor;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.agreements_zones;
DROP TABLE api.zones;
DROP TYPE zone_category;
