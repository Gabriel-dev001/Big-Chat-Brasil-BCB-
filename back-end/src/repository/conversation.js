const knex = require("../database/knex");

class ConversationRepository {
  static async getAll(client_id) {
    return knex("conversation").where({ client_id }).orWhere({ recipient_id: client_id }).select();
  }

  static async getById(id) {
    return knex("conversation").where({ id }).first();
  }

  static async getByClientRecipient(client_id, recipient_id) {
    return knex("conversation")
      .where({ client_id, recipient_id })
      .orWhere({ client_id: recipient_id, recipient_id: client_id })
      .first();
  }

  static async create(data) {
    const [id] = await knex("conversation").insert(data);
    return knex("conversation").where({ id }).first();
  }

  static async updateLastMessage(id, last_message) {
    return knex("conversation")
      .where({ id })
      .update({
        last_message,
        unread_count: knex.raw("unread_count + 1"),
      });
  }
}

module.exports = ConversationRepository;
