module.exports = class AnswerController {
  constructor(pool) {
    this.pool = pool;
  }

  async update(data) {
    try {
      const query = `
        UPDATE api.answers
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
