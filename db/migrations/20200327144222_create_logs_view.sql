-------------------------------------- UP --------------------------------------

CREATE VIEW api.logs AS
  SELECT *
  FROM public.logs;

GRANT SELECT ON api.logs TO administrator;

------------------------------------- DOWN -------------------------------------

REVOKE SELECT ON api.logs FROM administrator;

DROP VIEW api.logs;
