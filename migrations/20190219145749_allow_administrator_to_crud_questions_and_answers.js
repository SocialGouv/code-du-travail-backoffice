exports.up = async knex => {
  await knex.raw('GRANT USAGE ON SCHEMA api TO administrator');
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.answers TO administrator');
  await knex.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON api.questions TO administrator');
};

exports.down = async knex => {
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.answers FROM administrator');
  await knex.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON api.questions FROM administrator');
  await knex.raw('REVOKE USAGE ON SCHEMA api FROM administrator');
};
