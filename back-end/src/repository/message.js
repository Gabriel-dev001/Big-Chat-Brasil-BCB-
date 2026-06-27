const knex = require("../database/knex");

class MessageRepository {
  static async getAll(sender_id, content) {
    const query = knex("message").where("sender_id", sender_id);

    if (content) {
      query.andWhere("content", "like", `%${content}%`);
    }

    return query;
  }

  static async getById(id) {
    return knex("message").where({ id }).first();
  }

  static async getByConversationId(conversation_id) {
    return knex("message").where({ conversation_id }).select();
  }

  static async send(data) {
    return knex("message").insert(data);
  }

  static async updateStatus(id, status) {
    return knex("message").where({ id }).update({ status });
  }

  static async markRead(conversation_id, sender_id) {
    return knex("message")
      .where({ conversation_id, sender_id })
      .where("status", "=", "delivered")
      .update({ status: "read" });
  }
}

module.exports = MessageRepository;
