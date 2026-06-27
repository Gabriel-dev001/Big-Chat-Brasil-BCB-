const knex = require("../database/knex");

class QueueRepository {
  static async getStatusMessages() {
    const status = await knex("message").select("status").count("* as total").groupBy("status");

    const result = {
      queued: 0,
      processing: 0,
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
    };

    status.forEach((item) => {
      result[item.status] = Number(item.total);
    });

    return result;
  }
}

module.exports = QueueRepository;
