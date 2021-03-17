-------------------------------------- UP --------------------------------------

DROP VIEW api.full_answers;
DROP VIEW api.generic_answers;
DROP VIEW api.public_answers;

ALTER TABLE api.answers
  ALTER COLUMN state TYPE varchar(255),
  ALTER COLUMN state DROP DEFAULT;
DROP TYPE answer_state;

CREATE TYPE answer_state AS ENUM (
  'todo',
  'draft',
  'pending_review',
  'under_review',
  'validated',
  'published'
);

ALTER TABLE api.answers
  ALTER COLUMN state TYPE answer_state USING state::answer_state,
  ALTER COLUMN state SET DEFAULT 'todo';

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

CREATE VIEW api.public_answers AS
  SELECT
    id,
    parent_id,
    value,
    generic_reference,
    created_at,
    updated_at,
    question_id,
    agreement_id
  FROM api.answers answers
  WHERE answers.state = 'published';

GRANT SELECT ON api.public_answers TO anonymous;

------------------------------------- DOWN -------------------------------------

DROP VIEW api.full_answers;
DROP VIEW api.generic_answers;
DROP VIEW api.public_answers;

ALTER TABLE api.answers
  ALTER COLUMN state TYPE varchar(255),
  ALTER COLUMN state DROP DEFAULT;
DROP TYPE answer_state;

CREATE TYPE answer_state AS ENUM (
  'todo',
  'draft',
  'pending_review',
  'under_review',
  'validated'
);

ALTER TABLE api.answers
  ALTER COLUMN state TYPE answer_state USING state::answer_state,
  ALTER COLUMN state SET DEFAULT 'todo';

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
