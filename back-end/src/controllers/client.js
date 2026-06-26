const clientService = require("../service/client");

class ClientController {
  static async auth(request, response) {
    try {
      const { documentId, documentType } = request.body;

      const result = await clientService.auth(documentId, documentType);

      return response.status(200).json(result);
    } catch (error) {
      console.log(error);

      return response.status(500).json({
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
      console.log(error);

      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async getById(request, response) {
    try {
      const { id } = request.query;

      const result = await clientService.getById(id);

      return response.status(200).json(result);
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async getBalance(request, response) {
    try {
      const { id } = request.query;

      const result = await clientService.getBalance(id);

      return response.status(200).json(result);
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async create(request, response) {
    try {
      const { name, documentId, documentType, planType } = request.body;

      const result = await clientService.create(
        name,
        documentId,
        documentType,
        planType,
      );

      return response.status(200).json(result);
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async update(request, response) {
    try {
      const { id } = request.query;

      const { name, documentId, documentType } = request.body;

      const result = await clientService.update(
        id,
        name,
        documentId,
        documentType,
      );

      return response.status(200).json(result);
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }
}

module.exports = ClientController;
