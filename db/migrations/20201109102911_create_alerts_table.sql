-------------------------------------- UP --------------------------------------

CREATE TABLE api.alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  version text NOT NULL,
  dila_cid text NOT NULL,
  dila_id text NOT NULL,
  value jsonb NOT NULL,
  is_done boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT NOW(),

  answer_id uuid NOT NULL REFERENCES api.answers(id) ON DELETE CASCADE ON UPDATE CASCADE
);

GRANT SELECT, INSERT ON api.alerts TO anonymous;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.users TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.alerts;
