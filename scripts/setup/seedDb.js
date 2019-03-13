module.exports = async rootPath => {
  try {
    const config = require(`${rootPath}/knexfile.js`).development;
    const knex = require("knex")(config);

    await knex.seed.run();
  } catch (err) {
    console.log(err);
  }
};
