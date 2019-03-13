module.exports = async rootPath => {
  try {
    const config = require(`${rootPath}/knexfile.js`).development;
    const knex = require("knex")(config);
    await knex.migrate.latest();
  } catch (err) {
    console.log(err);
  }
};
