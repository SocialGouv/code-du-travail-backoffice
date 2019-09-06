-------------------------------------- UP --------------------------------------

ALTER TABLE api.tags
  DROP COLUMN category;

DROP TYPE tag_category;

CREATE TABLE api.tags_categories(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON api.tags_categories
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

GRANT SELECT ON api.tags_categories TO contributor;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.tags_categories TO administrator;

ALTER TABLE api.tags
  ADD COLUMN tag_category_id uuid REFERENCES api.tags_categories(id) ON DELETE SET NULL;

------------------------------------- DOWN -------------------------------------

ALTER TABLE api.tags
  DROP COLUMN tag_category_id;

DROP TABLE api.tags_categories;

CREATE TYPE tag_category AS ENUM (
  'contract_type',
  'distinctive_identity',
  'target',
  'theme',
  'work_schedule_type',
  'work_time'
);

ALTER TABLE api.tags
  ADD COLUMN category tag_category;
