const knex = require("../database/knex");

class ClientRepository {
  static async getByDocument(document_id) {
    return knex("client").where({ document_id }).first();
  }

  static async getAll() {
    return knex("client").select();
  }

  static async getById(id) {
    return knex("client").where({ id }).first();
  }

  static async getBalance(id) {
    return knex("client").where({ id }).first("plan_type", "balance", "limit");
  }

  static async create(data) {
    return knex("client").insert(data);
  }

  static async update(id, data) {
    return knex("client").where({ id }).update(data);
  }

  static async incrementBalance(id, message_cost) {
    return knex("client").where({ id }).increment("balance", message_cost);
  }

  static async decrementBalance(id, message_cost) {
    return knex("client").where({ id }).decrement("balance", message_cost);
  }
}

module.exports = ClientRepository;
