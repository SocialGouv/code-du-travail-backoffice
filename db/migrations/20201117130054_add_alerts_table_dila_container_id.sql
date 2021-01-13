-------------------------------------- UP --------------------------------------

ALTER TABLE api.alerts
  ADD COLUMN dila_container_id text NOT NULL;

------------------------------------- DOWN -------------------------------------

ALTER TABLE api.alerts
  DROP COLUMN dila_container_id;
