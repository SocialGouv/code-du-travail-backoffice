-------------------------------------- UP --------------------------------------

REVOKE SELECT ON api.logs FROM administrator;

DROP VIEW api.logs;

ALTER TABLE public.logs
  ADD COLUMN body text;

ALTER TABLE public.logs
  RENAME COLUMN action TO method;
ALTER TABLE public.logs
  RENAME COLUMN url TO path;

ALTER TYPE log_action
  RENAME TO log_method;

CREATE VIEW api.logs AS
  SELECT *
  FROM public.logs;

GRANT SELECT ON api.logs TO administrator;

------------------------------------- DOWN -------------------------------------

REVOKE SELECT ON api.logs FROM administrator;

DROP VIEW api.logs;

ALTER TABLE public.logs
  DROP COLUMN body;

ALTER TABLE public.logs
  RENAME COLUMN method TO action;
ALTER TABLE public.logs
  RENAME COLUMN path TO url;

ALTER TYPE log_method
  RENAME TO log_action;

CREATE VIEW api.logs AS
  SELECT *
  FROM public.logs;

GRANT SELECT ON api.logs TO administrator;
