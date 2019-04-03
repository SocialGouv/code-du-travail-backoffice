-------------------------------------- UP --------------------------------------


CREATE TYPE administrator_users_agreements AS (
  id uuid,
  name text,
  idcc char(4)
);

CREATE VIEW api.administrator_users AS
SELECT
    users.id,
    users.email,
    users.name,
    users.role,
    users.created_at,
    users.updated_at,
    locations.id AS location_id,
    locations.name AS location_name,
    array_remove(
      array_agg(
        (
          agreements.id,
          agreements.name,
          agreements.idcc
        )::administrator_users_agreements
      ),
      (NULL, NULL, NULL)::administrator_users_agreements
    ) AS agreements
  FROM auth.users users
  LEFT JOIN api.locations locations ON locations.id = users.location_id
  LEFT JOIN users_agreements ON users_agreements.user_id = users.id
  LEFT JOIN api.agreements agreements ON agreements.id = users_agreements.agreement_id
  GROUP BY
    users.id,
    locations.id;

GRANT SELECT ON api.administrator_users TO administrator;

------------------------------------- DOWN -------------------------------------

DROP VIEW api.administrator_users;

DROP TYPE administrator_users_agreements;
