-------------------------------------- UP --------------------------------------

ALTER TABLE api.locations
  DROP COLUMN area_id;

DROP TABLE api.areas;

DROP TYPE zone_category;

------------------------------------- DOWN -------------------------------------

CREATE TYPE zone_category AS ENUM (
  'department',
  'overseas_collectivity',
  'region',
  'sui_generis_collectivity'
);

CREATE TABLE api.areas(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  category zone_category NOT NULL,
  code varchar(5) UNIQUE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  parent_id uuid REFERENCES api.areas(id)
);

GRANT SELECT, INSERT, UPDATE ON api.areas TO administrator;
GRANT SELECT ON api.areas TO anonymous;
GRANT SELECT ON api.areas TO contributor;

ALTER TABLE api.locations
  ADD COLUMN area_id uuid REFERENCES api.areas(id);
