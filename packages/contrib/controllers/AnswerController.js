module.exports = class AnswerController {
  constructor(pool) {
    this.pool = pool;
  }

  async update(data) {
    data.id = "7c717d62-0839-4eeb-befc-33745e586f5b";

    try {
      const query = `
        UPDATE answers
        SET value=$1
        WHERE id=$2
      `;
      const values = [data.value, data.id];
      await this.pool.query(query, values);
    } catch (e) {
      console.error(e);
    }
  }
};
