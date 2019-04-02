-------------------------------------- UP --------------------------------------

GRANT USAGE ON SCHEMA auth TO administrator;

CREATE FUNCTION
  api.create_user(
    role name,
    email varchar(255),
    password varchar(255),
    name varchar(255),
    location_id uuid,
    agreements uuid[] DEFAULT '{}'::uuid[]
  ) RETURNS void AS $$
  DECLARE
    _user_id uuid;
  BEGIN
    INSERT INTO auth.users (role, email, password, name, location_id)
    VALUES (role, email, password, name, location_id)
    RETURNING id INTO _user_id;

    IF (array_length(agreements, 1) > 0) THEN
      INSERT INTO users_agreements (user_id, agreement_id)
      VALUES (_user_id, unnest(agreements));
    END IF;
  END
  $$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION api.create_user TO administrator;

CREATE FUNCTION
  api.update_user(
    id uuid,
    role name,
    email varchar(255),
    password varchar(255),
    name varchar(255),
    location_id uuid,
    agreements uuid[] DEFAULT '{}'::uuid[]
  ) RETURNS void AS $$
  DECLARE
    _agreement_id uuid;
    _email varchar(255) := email;
    _password varchar(255) := password;
    _id uuid := id;
    _location_id uuid := location_id;
    _name varchar(255) := name;
    _role name := role;
  BEGIN
    -- If the password is not an empty string, we need to update it:
    IF (LENGTH(_password) > 0) THEN
      UPDATE auth.users
      SET (role, email, password, name, location_id) =(
        _role,
        _email,
        _password,
        _name,
        _location_id
      )
      WHERE auth.users.id = _id;
    ELSE
      UPDATE auth.users
      SET (role, email, name, location_id) =(
        _role,
        _email,
        _name,
        _location_id
      )
      WHERE auth.users.id = _id;
    END IF;

    -- Insert new agreements which do not already exist:
    FOREACH _agreement_id IN ARRAY agreements
    LOOP
      IF NOT EXISTS (
        SELECT * FROM users_agreements
        WHERE user_id = _id
          AND agreement_id = _agreement_id
      ) THEN
        INSERT INTO users_agreements (user_id, agreement_id)
        VALUES (_id, _agreement_id);
      END IF;
    END LOOP;

    -- Delete existing agreements which are not part of the agreements array:
    DELETE FROM users_agreements
    WHERE user_id = _id
      AND NOT (agreement_id = ANY(agreements));
  END
  $$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION api.update_user TO administrator;

CREATE FUNCTION
  api.delete_user(id uuid) RETURNS void AS $$
  DECLARE
    _id uuid := id;
  BEGIN
    -- Unlink all the user current answers:
    UPDATE api.answers
    SET user_id = NULL
    WHERE user_id = _id;

    -- Delete the allowed agreements for this user:
    DELETE FROM users_agreements
    WHERE user_id = _id;

    DELETE FROM auth.users
    WHERE auth.users.id = _id;
  END
  $$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION api.delete_user TO administrator;

------------------------------------- DOWN -------------------------------------

DROP FUNCTION api.delete_user;
DROP FUNCTION api.update_user;
DROP FUNCTION api.create_user;

REVOKE USAGE ON SCHEMA auth FROM administrator;
