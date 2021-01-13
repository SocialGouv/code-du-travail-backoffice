-------------------------------------- UP --------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON api.alerts TO administrator;

------------------------------------- DOWN -------------------------------------

REVOKE SELECT, INSERT, UPDATE, DELETE ON api.alerts FROM administrator;
