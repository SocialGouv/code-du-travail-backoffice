-------------------------------------- UP --------------------------------------

UPDATE api.answers
  SET state = 'published'
  WHERE is_published IS TRUE

------------------------------------- DOWN -------------------------------------

UPDATE api.answers
  SET state = 'validated'
  WHERE is_published IS TRUE
