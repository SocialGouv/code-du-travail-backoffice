-------------------------------------- UP --------------------------------------

DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'regional_administrator') THEN
      CREATE ROLE regional_administrator NOINHERIT;
   END IF;
END
$do$;

GRANT USAGE ON SCHEMA api, auth, public TO regional_administrator;

GRANT SELECT ON api.agreements TO regional_administrator;
GRANT SELECT ON api.locations TO regional_administrator;
GRANT SELECT ON api.locations_agreements TO regional_administrator;
GRANT SELECT ON auth.users TO regional_administrator;
GRANT SELECT ON users_agreements TO regional_administrator;
GRANT SELECT ON api.questions TO regional_administrator;
GRANT SELECT ON api.answers TO regional_administrator;
GRANT SELECT ON api.tags TO regional_administrator;
GRANT SELECT ON api.answers_tags TO regional_administrator;
GRANT SELECT ON api.answers_references TO regional_administrator;
GRANT SELECT ON api.full_answers TO regional_administrator;

------------------------------------- DOWN -------------------------------------

REVOKE SELECT ON api.full_answers FROM regional_administrator;
REVOKE SELECT ON api.answers_references FROM regional_administrator;
REVOKE SELECT ON api.answers_tags FROM regional_administrator;
REVOKE SELECT ON api.tags FROM regional_administrator;
REVOKE SELECT ON api.answers FROM regional_administrator;
REVOKE SELECT ON api.questions FROM regional_administrator;
REVOKE SELECT ON users_agreements FROM regional_administrator;
REVOKE SELECT ON auth.users FROM regional_administrator;
REVOKE SELECT ON api.locations_agreements FROM regional_administrator;
REVOKE SELECT ON api.locations FROM regional_administrator;
REVOKE SELECT ON api.agreements FROM regional_administrator;

REVOKE USAGE ON SCHEMA api, auth, public FROM regional_administrator;
#DROP ROLE regional_administrator;
