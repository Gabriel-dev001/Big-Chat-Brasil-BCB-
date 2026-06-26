const knex = require("../database/knex");

class ConversationRepository {
  static async getAll(client_id) {
    try {
      return knex("conversation").where({ client_id }).select();
    } catch (error) {
      console.log(error);
    }
  }

  static async getById(id) {
    try {
      return knex("conversation").where({ id }).first();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ConversationRepository;
