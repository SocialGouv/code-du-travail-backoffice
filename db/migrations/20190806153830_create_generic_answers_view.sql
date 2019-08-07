-------------------------------------- UP --------------------------------------

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

DROP VIEW api.generic_answers;
