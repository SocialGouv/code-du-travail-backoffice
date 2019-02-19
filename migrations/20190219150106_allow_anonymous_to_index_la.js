exports.up = async knex => {
  await knex.raw('GRANT SELECT ON api.labor_agreements TO anonymous');
  await knex.raw('GRANT SELECT ON api.labor_agreements TO contributor');
  await knex.raw('GRANT SELECT ON api.labor_agreements TO validator');
};

exports.down = async knex => {
  await knex.raw('REVOKE SELECT ON api.labor_agreements FROM administrator');
  await knex.raw('REVOKE SELECT ON api.labor_agreements FROM contributor');
  await knex.raw('REVOKE SELECT ON api.labor_agreements FROM validator');
};
