exports.up = async knex => {
  await knex.schema.raw('ALTER TABLE api.answers ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP');
  await knex.schema.raw('ALTER TABLE api.answers ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP');
  await knex.schema.raw('ALTER TABLE api.locations ALTER COLUMN id SET DEFAULT uuid_generate_v4()');
  await knex.schema.raw('ALTER TABLE api.locations ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP');
  await knex.schema.raw('ALTER TABLE api.locations ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP');
  await knex.schema.raw('ALTER TABLE api.questions ALTER COLUMN id SET DEFAULT uuid_generate_v4()');
  await knex.schema.raw('ALTER TABLE api.questions ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP');
  await knex.schema.raw('ALTER TABLE api.questions ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP');
  await knex.schema.raw('ALTER TABLE basic_auth.users ALTER COLUMN id SET DEFAULT uuid_generate_v4()');
  await knex.schema.raw('ALTER TABLE basic_auth.users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP');
  await knex.schema.raw('ALTER TABLE basic_auth.users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP');
};

exports.down = async knex => {
  await knex.schema.raw('ALTER TABLE api.answers ALTER COLUMN created_at DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE api.answers ALTER COLUMN updated_at DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE api.locations ALTER COLUMN id DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE api.locations ALTER COLUMN created_at DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE api.locations ALTER COLUMN updated_at DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE api.questions ALTER COLUMN id DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE api.questions ALTER COLUMN created_at DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE api.questions ALTER COLUMN updated_at DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE basic_auth.users ALTER COLUMN id DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE basic_auth.users ALTER COLUMN created_at DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE basic_auth.users ALTER COLUMN updated_at DROP DEFAULT');
};
