-------------------------------------- UP --------------------------------------

CREATE TABLE auth.users(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role name NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  location_id uuid NOT NULL REFERENCES api.locations(id)
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

/*
  Encrypt "password" field value within a given INSERT or UPDATE using
  "pgcrypto" extension "crypt()' and "gen_salt()" functions.

  @see https://www.postgresql.org/docs/11/pgcrypto.html
*/
CREATE FUNCTION
  auth.encrypt_password() RETURNS TRIGGER AS $$
  BEGIN
    IF tg_op = 'INSERT' OR new.password <> old.password THEN
      new.password = crypt(new.password, gen_salt('bf'));
    END IF;

    RETURN new;
  END
  $$ LANGUAGE plpgsql;

/*
  Trigger "password" field value encryption on any INSERT ot UPDATE within
  "auth.users" table.
*/
CREATE TRIGGER encrypt_password
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE auth.encrypt_password();

/**
  Check if "role" field value within a given INSERT or UPDATE exists in default
  "pg_roles" table.
*/
CREATE FUNCTION
  auth.check_role_exists() RETURNS TRIGGER AS $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles AS r WHERE r.rolname = new.role) THEN
      RAISE foreign_key_violation USING MESSAGE = 'Unknown database role: ' || new.role || '.';

      RETURN null;
    END IF;

    RETURN new;
  END
  $$ LANGUAGE plpgsql;

/*
  Trigger "role" field value checking function on any INSERT ot UPDATE within
  "auth.users" table.
*/
CREATE CONSTRAINT TRIGGER ensure_user_role_exists
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE auth.check_role_exists();

-- Anonymous users need access to this table to use the later on login()
-- function. This table is not exposed by PostgREST since only the ones under
-- "api" schema are.
GRANT SELECT ON auth.users TO anonymous;
GRANT SELECT ON auth.users TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.users TO administrator;

CREATE TABLE users_agreements(
  id serial PRIMARY KEY,

  user_id uuid NOT NULL REFERENCES auth.users(id),
  agreement_id uuid NOT NULL REFERENCES api.agreements(id)
);

GRANT SELECT ON users_agreements TO anonymous;
GRANT SELECT ON users_agreements TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON users_agreements TO administrator;
GRANT USAGE, SELECT ON SEQUENCE users_agreements_id_seq TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE users_agreements;
DROP TABLE auth.users;

DROP FUNCTION auth.check_role_exists;
DROP FUNCTION auth.encrypt_password;
