const authStore = require("../middlewares/authStore");

const clientService = require("../service/client");

class ClientController {
  static async auth(request, response) {
    try {
      const { document_id, document_type } = request.body;

      const result = await clientService.auth(document_id, document_type);

      if (result.login && result.exists && result.token) {
        authStore.tokens.add(result.token);
      }

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        login: false,
        exists: false,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async getAll(request, response) {
    try {
      const result = await clientService.getAll();

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async getById(request, response) {
    try {
      const { id } = request.params;

      const result = await clientService.getById(id);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async getBalance(request, response) {
    try {
      const { id } = request.params;

      const result = await clientService.getBalance(id);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async create(request, response) {
    try {
      const { name, document_id, document_type, plan_type } = request.body;

      const result = await clientService.create(name, document_id, document_type, plan_type);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async update(request, response) {
    try {
      const { id } = request.params;

      const { name, document_id, document_type } = request.body;

      const result = await clientService.update(id, name, document_id, document_type);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }
}

module.exports = ClientController;
