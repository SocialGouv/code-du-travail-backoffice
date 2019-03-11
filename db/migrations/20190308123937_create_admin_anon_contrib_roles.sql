-------------------------------------- UP --------------------------------------

CREATE ROLE anonymous NOINHERIT NOLOGIN;
GRANT USAGE ON SCHEMA api, public TO anonymous;

CREATE ROLE administrator NOINHERIT;
GRANT USAGE ON SCHEMA api, public TO administrator;

CREATE ROLE contributor NOINHERIT;
GRANT USAGE ON SCHEMA api, public TO contributor;

------------------------------------- DOWN -------------------------------------

REVOKE USAGE ON SCHEMA api, public FROM contributor;
DROP ROLE contributor;

REVOKE USAGE ON SCHEMA api, public FROM administrator;
DROP ROLE administrator;

REVOKE USAGE ON SCHEMA api, public FROM anonymous;
DROP ROLE anonymous;
