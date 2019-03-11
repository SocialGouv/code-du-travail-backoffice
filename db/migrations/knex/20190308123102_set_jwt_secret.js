/**
 * TODO Find a better way to pass the JWT secret.
 */
exports.up = async knex => {
  await knex.raw(`
    CREATE FUNCTION
      getJwtSecret() RETURNS name AS $$
      BEGIN
        RETURN '${process.env.PGRST_JWT_SECRET}';
      END
      $$ LANGUAGE plpgsql;
  `);
};

exports.down = async knex => {
  await knex.raw(`
    DROP FUNCTION getJwtSecret;
  `);
};
