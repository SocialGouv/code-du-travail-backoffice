-------------------------------------- UP --------------------------------------

GRANT SELECT ON api.locations_agreements TO anonymous;

------------------------------------- DOWN -------------------------------------

REVOKE SELECT ON api.locations_agreements FROM anonymous;
