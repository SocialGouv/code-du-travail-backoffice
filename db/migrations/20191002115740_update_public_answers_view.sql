-------------------------------------- UP --------------------------------------

DROP VIEW api.public_answers;

CREATE VIEW api.public_answers AS
  SELECT
    id,
    parent_id,
    value,
    generic_reference,
    is_published,
    created_at,
    updated_at,
    question_id,
    agreement_id
  FROM api.answers answers
  WHERE answers.state = 'validated'
    AND answers.is_published = TRUE;

GRANT SELECT ON api.public_answers TO anonymous;

------------------------------------- DOWN -------------------------------------

DROP VIEW api.public_answers;

CREATE VIEW api.public_answers AS
  SELECT
    id,
    parent_id,
    value,
    generic_reference,
    is_published,
    created_at,
    updated_at,
    question_id,
    agreement_id
  FROM api.answers answers
  WHERE answers.state = 'validated';

GRANT SELECT ON api.public_answers TO anonymous;
