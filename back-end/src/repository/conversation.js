const knex = require("../database/knex");

class ConversationRepository {
  static async getAll(client_id) {
    return knex("conversation").where({ client_id }).select();
  }

  static async getById(id) {
    return knex("conversation").where({ id }).first();
  }

  static async getByClientRecipient(client_id, recepient_id) {
    return knex("conversation").where({ client_id, recepient_id }).first();
  }
}

module.exports = ConversationRepository;
