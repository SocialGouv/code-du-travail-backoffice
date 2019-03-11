-------------------------------------- UP --------------------------------------

CREATE TYPE tag_category AS ENUM (
  'contract_type',
  'distinctive_identity',
  'target',
  'theme',
  'work_schedule_type',
  'work_time'
);

CREATE TABLE api.tags(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  value varchar(255) UNIQUE NOT NULL,
  category tag_category NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.tags
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT ON api.tags TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.tags TO administrator;

CREATE TABLE api.questions_tags(
  id serial PRIMARY KEY,

  question_id uuid NOT NULL REFERENCES api.questions(id),
  tag_id uuid NOT NULL REFERENCES api.tags(id)
);

GRANT SELECT ON api.questions_tags TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.questions_tags TO administrator;
GRANT USAGE, SELECT ON SEQUENCE api.questions_tags_id_seq TO administrator;

CREATE TABLE api.answers_tags(
  id serial PRIMARY KEY,

  answer_id uuid NOT NULL REFERENCES api.answers(id),
  tag_id uuid NOT NULL REFERENCES api.tags(id)
);

CREATE CONSTRAINT TRIGGER ensure_user_can_update_answer
  AFTER UPDATE ON api.answers_tags
  FOR EACH ROW
  EXECUTE PROCEDURE check_user_can_update_answer();

GRANT SELECT, INSERT, DELETE ON api.answers_tags TO contributor;
GRANT USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers_tags TO administrator;
GRANT USAGE, SELECT ON SEQUENCE api.answers_tags_id_seq TO administrator;

------------------------------------- DOWN -------------------------------------

DROP TABLE api.answers_tags;
DROP TABLE api.questions_tags;
DROP TABLE api.tags;

DROP TYPE tag_category;
