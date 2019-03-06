exports.up = async knex => {
  await knex.raw(`
    CREATE VIEW api.my_answers AS
      SELECT
        a.*,
        q.value AS question,
        g.name AS agreement,
        g.idcc,
        (CASE WHEN at.tag_id IS NULL THEN ARRAY[]::uuid[] ELSE array_agg(at.tag_id) END) AS tags
      FROM api.answers a
      INNER JOIN api.questions q ON q.id = a.question_id
      INNER JOIN api.agreements g ON g.id = a.agreement_id
      LEFT JOIN api.answers_tags at ON at.answer_id = a.id
      WHERE
        a.agreement_id = ANY(get_current_user_agreements()::uuid[])
        AND (
          a.editor_id = 'df8cf181-ad3b-4284-9e9e-dc38dc1542ec'
          OR a.editor_id IS NULL
        )
      GROUP BY a.id, q.value, g.name, g.idcc, at.tag_id
  `);

  await knex.raw('GRANT SELECT ON api.my_answers TO contributor')
}

exports.down = async knex => {
  await knex.raw('REVOKE SELECT ON api.my_answers FROM contributor')

  await knex.raw('DROP VIEW api.my_answers')
}
