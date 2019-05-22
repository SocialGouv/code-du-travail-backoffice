-------------------------------------- UP --------------------------------------

GRANT SELECT ON api.agreements TO anonymous;

------------------------------------- DOWN -------------------------------------

REVOKE SELECT ON api.agreements FROM anonymous;
