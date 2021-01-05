-------------------------------------- UP --------------------------------------


DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'anonymous') THEN
      CREATE ROLE anonymous NOINHERIT NOLOGIN;
   END IF;
END
$do$;

GRANT USAGE ON SCHEMA api, public TO anonymous;

DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'administrator') THEN
      CREATE ROLE administrator NOINHERIT;
   END IF;
END
$do$;

GRANT USAGE ON SCHEMA api, public TO administrator;

DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'contributor') THEN
      CREATE ROLE contributor NOINHERIT;
   END IF;
END
$do$;

GRANT USAGE ON SCHEMA api, public TO contributor;

------------------------------------- DOWN -------------------------------------

REVOKE USAGE ON SCHEMA api, public FROM contributor;
#DROP ROLE contributor;

REVOKE USAGE ON SCHEMA api, public FROM administrator;
#DROP ROLE administrator;

REVOKE USAGE ON SCHEMA api, public FROM anonymous;
#DROP ROLE anonymous;
