-------------------------------------- UP --------------------------------------

ALTER TABLE api.answers_references
  DROP COLUMN is_skipped;

------------------------------------- DOWN -------------------------------------

ALTER TABLE api.answers_references
  ADD COLUMN is_skipped boolean NOT NULL DEFAULT FALSE;
