-------------------------------------- UP --------------------------------------

REVOKE SELECT ON api.logs FROM administrator;

ALTER TABLE api.logs SET SCHEMA public;

GRANT SELECT, DELETE ON public.logs TO administrator;

------------------------------------- DOWN -------------------------------------

REVOKE SELECT, DELETE ON logs FROM administrator;

ALTER TABLE public.logs SET SCHEMA api;

GRANT SELECT ON api.logs TO administrator;
