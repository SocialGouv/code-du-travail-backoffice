-------------------------------------- UP --------------------------------------

-- This table is useless:
DROP TABLE api.agreements_zones;

ALTER TABLE api.zones
  RENAME TO areas;

ALTER TABLE api.locations
  RENAME COLUMN zone_id TO area_id;

------------------------------------- DOWN -------------------------------------

ALTER TABLE api.areas
  RENAME TO zones;

ALTER TABLE api.locations
  RENAME COLUMN area_id TO zone_id;

CREATE TABLE api.agreements_zones(
  id serial PRIMARY KEY,

  agreement_id uuid NOT NULL REFERENCES api.agreements(id),
  zone_id uuid NOT NULL REFERENCES api.zones(id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON api.agreements_zones TO administrator;
GRANT USAGE, SELECT ON SEQUENCE api.agreements_zones_id_seq TO administrator;
GRANT SELECT ON api.agreements_zones TO anonymous;
GRANT SELECT ON api.agreements_zones TO contributor;
