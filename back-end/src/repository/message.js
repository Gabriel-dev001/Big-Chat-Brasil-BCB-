const knex = require("../database/knex");

class MessageRepository {
  static async getAll(sender_id, content) {
    try {
      const query = knex("message").where("sender_id", sender_id);

      if (content) {
        query.andWhere("content", "like", `%${content}%`);
      }

      return await query;
    } catch (error) {
      console.log(error);
    }
  }

  static async getById(id) {
    try {
      return knex("message").where({ id }).first();
    } catch (error) {
      console.log(error);
    }
  }

  static async getByConversationId(conversation_id) {
    try {
      return knex("message").where({ conversation_id }).select();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = MessageRepository;
