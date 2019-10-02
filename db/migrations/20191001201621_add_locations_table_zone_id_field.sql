-------------------------------------- UP --------------------------------------

ALTER TABLE api.locations
  ADD COLUMN zone_id uuid REFERENCES api.zones(id);

------------------------------------- DOWN -------------------------------------

ALTER TABLE api.locations
  DROP COLUMN zone_id;
