exports.up = async knex => {
  await knex.schema.raw(`
    CREATE OR REPLACE FUNCTION
    api.login(email text, password text) RETURNS basic_auth.jwt_token AS $$
    DECLARE
      _role name;
      _user_id char(36);
      result basic_auth.jwt_token;
    BEGIN
      -- Check user email and password
      SELECT basic_auth.user_role(email, password) INTO _role;
      IF _role IS NULL THEN
        RAISE invalid_password USING MESSAGE = 'Invalid email and/or password.';
      END IF;

      -- Select the user ID of the the logged user and assign it to _user_id record variable.
      -- https://www.postgresql.org/docs/9.6/plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW
      SELECT id INTO _user_id FROM basic_auth.users WHERE basic_auth.users.email = login.email;

      -- Generate the JWT token and return it as a within a stringified JSON object
      -- with these properties: role, id & email.
      SELECT sign(row_to_json(r), '${process.env.POSTGREST_SECRET}') AS token
      FROM (
          SELECT _role AS role, _user_id AS id, login.email AS email,
            extract(epoch FROM now())::integer + 60*60 AS exp
        ) r
        INTO result;

      RETURN result;
    END;
    $$ language plpgsql
  `);
};

exports.down = async knex => {
  await knex.schema.raw(`
    CREATE OR REPLACE FUNCTION
    api.login(email text, password text) RETURNS basic_auth.jwt_token AS $$
    DECLARE
      _role name;
      result basic_auth.jwt_token;
    BEGIN
      -- Check email and password
      SELECT basic_auth.user_role(email, password) INTO _role;
      IF _role IS NULL THEN
        RAISE invalid_password USING MESSAGE = 'Invalid email and/or password.';
      END IF;

      SELECT sign(row_to_json(r), '${process.env.POSTGREST_SECRET}') AS token
        FROM (
          SELECT _role AS role, login.email AS email,
            extract(epoch FROM now())::integer + 60*60 AS exp
        ) r
        INTO result;
      RETURN result;
    END;
    $$ language plpgsql
  `);
};
