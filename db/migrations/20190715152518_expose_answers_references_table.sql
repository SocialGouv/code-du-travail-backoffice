-------------------------------------- UP --------------------------------------

GRANT SELECT ON api.answers_references TO anonymous;

------------------------------------- DOWN -------------------------------------

REVOKE SELECT ON api.answers_references FROM anonymous;
