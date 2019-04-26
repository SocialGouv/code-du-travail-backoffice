-------------------------------------- UP --------------------------------------

DROP VIEW api.contributor_answers;

ALTER TABLE api.agreements
  ADD COLUMN parent_id uuid REFERENCES api.agreements(id) ON DELETE SET NULL;

/*
  - `labor_code`: Generic answer falling back to the Labor Code
  - `national_agreement`: Generic answer falling back to the national agreement
*/
CREATE TYPE answer_generic_reference AS ENUM (
  'labor_code',
  'national_agreement'
);

ALTER TABLE api.answers
  ADD COLUMN generic_reference answer_generic_reference;

CREATE VIEW api.contributor_answers AS
SELECT
    answers.*,
    questions.value AS question,
    agreements.name AS agreement,
    agreements.idcc,
    -- https://stackoverflow.com/a/23050948/2736233
    array_remove(array_agg(tags.tag_id), NULL) AS tags,
    -- https://stackoverflow.com/a/34163623/2736233
    array_remove(
      array_agg(
        (refs.category, refs.value, refs.url)::contributor_answers_references
      ),
      (NULL, NULL, NULL)::contributor_answers_references
    ) AS references
  FROM api.answers answers
  LEFT JOIN api.questions questions ON questions.id = answers.question_id
  LEFT JOIN api.agreements agreements ON agreements.id = answers.agreement_id
  LEFT JOIN api.answers_tags tags ON tags.answer_id = answers.id
  LEFT JOIN api.answers_references refs ON refs.answer_id = answers.id
  WHERE
    answers.agreement_id = ANY(get_current_user_agreements()::uuid[])
    AND (
      answers.user_id = current_setting('request.jwt.claim.id', true)::uuid
      OR answers.user_id IS NULL
    )
  GROUP BY
    answers.id,
    questions.value,
    agreements.name,
    agreements.idcc;

GRANT SELECT ON api.contributor_answers TO contributor;

------------------------------------- DOWN -------------------------------------

DROP VIEW api.contributor_answers;

ALTER TABLE api.answers
  DROP COLUMN generic_reference;

DROP TYPE answer_generic_reference;

ALTER TABLE api.agreements
  DROP COLUMN parent_id;

CREATE VIEW api.contributor_answers AS
SELECT
    answers.*,
    questions.value AS question,
    agreements.name AS agreement,
    agreements.idcc,
    -- https://stackoverflow.com/a/23050948/2736233
    array_remove(array_agg(tags.tag_id), NULL) AS tags,
    -- https://stackoverflow.com/a/34163623/2736233
    array_remove(
      array_agg(
        (refs.category, refs.value, refs.url)::contributor_answers_references
      ),
      (NULL, NULL, NULL)::contributor_answers_references
    ) AS references
  FROM api.answers answers
  LEFT JOIN api.questions questions ON questions.id = answers.question_id
  LEFT JOIN api.agreements agreements ON agreements.id = answers.agreement_id
  LEFT JOIN api.answers_tags tags ON tags.answer_id = answers.id
  LEFT JOIN api.answers_references refs ON refs.answer_id = answers.id
  WHERE
    answers.agreement_id = ANY(get_current_user_agreements()::uuid[])
    AND (
      answers.user_id = current_setting('request.jwt.claim.id', true)::uuid
      OR answers.user_id IS NULL
    )
  GROUP BY
    answers.id,
    questions.value,
    agreements.name,
    agreements.idcc;
