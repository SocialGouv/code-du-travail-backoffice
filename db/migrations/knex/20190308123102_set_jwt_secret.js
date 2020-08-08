/**
 * @see http://postgrest.org/en/latest/auth.html#jwt-from-sql
 */

const { PGRST_JWT_SECRET, POSTGRES_DB } = process.env;

exports.up = async knex => {
  console.log(knex);
  await knex.raw(`
    ALTER DATABASE ${POSTGRES_DB}
      SET "app.jwt_secret" TO '${PGRST_JWT_SECRET}';
  `);
};

exports.down = async knex => {
  await knex.raw(`
    ALTER DATABASE ${POSTGRES_DB}
      RESET "app.jwt_secret";
  `);
};
