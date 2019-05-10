-------------------------------------- UP --------------------------------------

CREATE VIEW api.administrator_migrations AS
  SELECT *
  FROM public.migrations users;

GRANT SELECT, UPDATE ON api.administrator_migrations TO administrator;

------------------------------------- DOWN -------------------------------------

DROP VIEW api.administrator_migrations;
