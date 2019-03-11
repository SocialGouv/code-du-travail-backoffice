-------------------------------------- UP --------------------------------------

CREATE SCHEMA auth;

GRANT USAGE ON SCHEMA auth TO anonymous;
GRANT USAGE ON SCHEMA auth TO contributor;

------------------------------------- DOWN -------------------------------------

DROP SCHEMA auth;
