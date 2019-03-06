exports.up = async knex => {
  await knex.raw(`
    CREATE VIEW api.my_answers AS
      SELECT
        a.*,
        q.value AS question,
        g.name AS agreement,
        g.idcc,
        array_agg(at.tag_id) as tags
      FROM api.answers a
      INNER JOIN api.questions q ON q.id = a.question_id
      INNER JOIN api.agreements g ON g.id = a.agreement_id
      LEFT JOIN answers_tags at ON at.answer_id = a.id
      WHERE
        a.agreement_id = ANY(get_current_user_agreements()::uuid[])
        AND (
          a.editor_id = current_setting('request.jwt.claim.id', true)::uuid
          OR a.editor_id IS NULL
        )
      GROUP BY a.id, q.value, g.name, g.idcc
  `)

  await knex.raw('GRANT SELECT ON api.my_answers TO contributor')
}

exports.down = async knex => {
  await knex.raw('REVOKE SELECT ON api.my_answers FROM contributor')

  await knex.raw('DROP VIEW api.my_answers')
}
