exports.up = async knex => {
  await knex.raw('REVOKE SELECT ON api.labor_agreements FROM anonymous')
}

exports.down = async knex => {
  await knex.raw('GRANT SELECT ON api.labor_agreements TO anonymous')
}
