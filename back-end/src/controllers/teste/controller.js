const moment = require("moment");

const knex = require("../../database/knex");

class testeController {
  static async teste(request, response) {
    try {
      let client = await knex("client").first();

      console.log(client);

      return response.json({ message: "Api rodando" });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = testeController;
