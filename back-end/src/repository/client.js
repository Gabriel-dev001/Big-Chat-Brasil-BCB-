const knex = require("../database/knex");

class ClientRepository {
  static async getByDocument(documentId) {
    try {
      return knex("client").where({ documentId }).first();
    } catch (error) {
      console.log(error);
    }
  }

  static async getAll() {
    try {
      return knex("client").select();
    } catch (error) {
      console.log(error);
    }
  }

  static async getById(id) {
    try {
      return knex("client").where({ id }).first();
    } catch (error) {
      console.log(error);
    }
  }

  static async getBalance(id) {
    try {
      return knex("client").where({ id }).first("planType", "balance", "limit");
    } catch (error) {
      console.log(error);
    }
  }

  static async create(data) {
    try {
      return knex("client").insert(data);
    } catch (error) {
      console.log(error);
    }
  }

  static async update(id, data) {
    try {
      return knex("client").where({ id }).update(data);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ClientRepository;
