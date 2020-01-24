-------------------------------------- UP --------------------------------------

CREATE TYPE log_action AS ENUM (
  'delete',
  'patch',
  'post'
);

CREATE TABLE api.logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip text NOT NULL,
  action log_action NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),

  user_id uuid REFERENCES auth.users(id)
);

GRANT SELECT ON api.logs TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.logs;

DROP TYPE log_action;

