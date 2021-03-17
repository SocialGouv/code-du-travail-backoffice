-------------------------------------- UP --------------------------------------

DROP VIEW api.full_answers;
DROP VIEW api.generic_answers;

ALTER TABLE api.answers
  DROP COLUMN is_published;

CREATE VIEW api.full_answers AS
  SELECT
    answers.*,
    questions.index AS question_index,
    questions.value AS question_value,
    agreements.name AS agreement_name,
    agreements.idcc AS agreement_idcc
  FROM api.answers answers
  LEFT JOIN api.questions questions ON questions.id = answers.question_id
  LEFT JOIN api.agreements agreements ON agreements.id = answers.agreement_id;

GRANT SELECT ON api.full_answers TO administrator;
GRANT SELECT ON api.full_answers TO contributor;

CREATE VIEW api.generic_answers AS
  SELECT
    answers.*,
    questions.index AS question_index,
    questions.value AS question_value
  FROM api.answers answers
  INNER JOIN api.questions questions ON questions.id = answers.question_id
  WHERE answers.agreement_id IS NULL;

GRANT SELECT ON api.generic_answers TO administrator;
GRANT SELECT ON api.generic_answers TO contributor;

------------------------------------- DOWN -------------------------------------

ALTER TABLE api.answers
  ADD COLUMN is_published boolean NOT NULL DEFAULT FALSE;

UPDATE api.answers
  SET is_published = TRUE
  WHERE state = 'published'
