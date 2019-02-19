exports.up = async knex => {
  await knex.schema.withSchema('api').alterTable('answers', table => {
    table.uuid('labor_agreement_id')
    table.foreign('labor_agreement_id').references('id').on('api.labor_agreements')
  })
};

exports.down = async knex => {
  await knex.schema.withSchema('api').alterTable('answers', table => {
    table.dropColumn('labor_agreement_id');
  });
};
