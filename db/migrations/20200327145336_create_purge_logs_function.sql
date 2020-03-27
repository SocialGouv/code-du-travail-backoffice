-------------------------------------- UP --------------------------------------

CREATE FUNCTION
  api.purge_logs() RETURNS void AS $$
  BEGIN
    DELETE FROM public.logs
    WHERE created_at < now() - interval '1 week';
  END
  $$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION api.purge_logs TO administrator;

------------------------------------- DOWN -------------------------------------

REVOKE EXECUTE ON FUNCTION api.purge_logs FROM administrator;

DROP FUNCTION api.purge_logs;
