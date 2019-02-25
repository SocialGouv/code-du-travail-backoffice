
module.exports = async rootPath => {
  const config = require(`${rootPath}/knexfile.js`).development;
  const knex = require('knex')(config)

  return knex.migrate.latest()
}
