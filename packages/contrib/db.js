const { Pool } = require("pg");

module.exports = async function(dbUri) {
  const pool = new Pool({ connectionString: dbUri });
  await pool.connect();

  return pool;
};
