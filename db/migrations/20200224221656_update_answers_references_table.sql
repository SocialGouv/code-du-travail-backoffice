-------------------------------------- UP --------------------------------------

ALTER TABLE api.answers_references
  ADD COLUMN dila_id text;

------------------------------------- DOWN -------------------------------------

ALTER TABLE api.answers_references
  DROP COLUMN dila_id;
