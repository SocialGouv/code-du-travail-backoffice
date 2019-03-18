/**
 * @see http://postgrest.org/en/v5.2/auth.html#jwt-from-sql
 */

exports.up = async knex => {
  await knex.raw(`
    ALTER DATABASE ${process.env.POSTGRES_DB}
      SET "app.jwt_secret" TO '${process.env.PGRST_JWT_SECRET}';
  `);
};

exports.down = async knex => {
  await knex.raw(`
    ALTER DATABASE ${process.env.POSTGRES_DB}
      RESET "app.jwt_secret";
  `);
};
