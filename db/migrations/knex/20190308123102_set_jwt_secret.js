/**
 * @see http://postgrest.org/en/latest/auth.html#jwt-from-sql
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
