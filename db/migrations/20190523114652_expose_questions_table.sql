-------------------------------------- UP --------------------------------------

GRANT SELECT ON api.questions TO anonymous;

------------------------------------- DOWN -------------------------------------

REVOKE SELECT ON api.questions FROM anonymous;
