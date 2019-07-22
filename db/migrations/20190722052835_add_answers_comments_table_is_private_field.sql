-------------------------------------- UP --------------------------------------

ALTER TABLE api.answers_comments
  ADD COLUMN is_private boolean NOT NULL DEFAULT FALSE;

------------------------------------- DOWN -------------------------------------

ALTER TABLE api.answers_comments
  DROP COLUMN is_private;
