exports.up = async knex => {
  await knex.schema.raw('ALTER TABLE api.labor_agreements ALTER COLUMN name TYPE text');
};

exports.down = async knex => {
  await knex.schema.raw('ALTER TABLE api.labor_agreements ALTER COLUMN name TYPE varchar(255)');
};
