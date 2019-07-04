-------------------------------------- UP --------------------------------------

CREATE VIEW api.full_answers AS
SELECT
    answers.*,
    questions.index AS question_index,
    questions.value AS question_value,
    agreements.name AS agreement_name,
    agreements.idcc AS agreement_idcc
  FROM api.answers answers
  INNER JOIN api.questions questions ON questions.id = answers.question_id
  INNER JOIN api.agreements agreements ON agreements.id = answers.agreement_id;

GRANT SELECT ON api.full_answers TO administrator;
GRANT SELECT ON api.full_answers TO contributor;

------------------------------------- DOWN -------------------------------------

DROP VIEW api.full_answers;
