-------------------------------------- UP --------------------------------------

CREATE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();

    RETURN NEW;
  END
  $$ LANGUAGE plpgsql;

------------------------------------- DOWN -------------------------------------

DROP FUNCTION set_updated_at;
