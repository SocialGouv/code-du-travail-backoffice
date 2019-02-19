exports.up = async knex => {
  await knex.schema.raw(`
    ALTER TABLE api.answers
    ALTER COLUMN user_id
    SET DEFAULT current_setting('request.jwt.claim.id', true)::uuid
  `);
  await knex.schema.raw(`
    ALTER TABLE api.questions
    ALTER COLUMN user_id
    SET DEFAULT current_setting('request.jwt.claim.id', true)::uuid
  `);
};

exports.down = async knex => {
  await knex.schema.raw('ALTER TABLE api.answers ALTER COLUMN created_at DROP DEFAULT');
  await knex.schema.raw('ALTER TABLE api.questions ALTER COLUMN updated_at DROP DEFAULT');
};
