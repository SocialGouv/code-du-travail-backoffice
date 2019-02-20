exports.up = async knex => {
  await knex.raw('GRANT USAGE ON SCHEMA api TO contributor');
  await knex.raw('GRANT SELECT, UPDATE ON api.answers TO contributor');
  await knex.raw('GRANT SELECT, UPDATE ON api.questions TO contributor');
};

exports.down = async knex => {
  await knex.raw('REVOKE SELECT, UPDATE ON api.answers FROM contributor');
  await knex.raw('REVOKE SELECT, UPDATE ON api.questions FROM contributor');
  await knex.raw('REVOKE USAGE ON SCHEMA api FROM contributor');
};
