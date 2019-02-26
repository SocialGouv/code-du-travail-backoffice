exports.up = async knex => {
  await knex.raw('REVOKE SELECT ON api.tags FROM anonymous')
  await knex.raw('REVOKE SELECT ON api.answers_tags FROM anonymous')
  await knex.raw('REVOKE SELECT ON api.questions_tags FROM anonymous')
  await knex.raw('REVOKE SELECT ON api.answers FROM anonymous')
  await knex.raw('REVOKE SELECT ON api.questions FROM anonymous')
}

exports.down = async knex => {
  await knex.raw('GRANT SELECT ON api.tags TO anonymous')
  await knex.raw('GRANT SELECT ON api.answers_tags TO anonymous')
  await knex.raw('GRANT SELECT ON api.questions_tags TO anonymous')
  await knex.raw('GRANT SELECT ON api.answers TO anonymous')
  await knex.raw('GRANT SELECT ON api.questions TO anonymous')
}
