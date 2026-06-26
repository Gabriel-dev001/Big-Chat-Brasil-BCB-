const conversationService = require("../service/conversation");

class ConversationController {
  static async getAll(request, response) {
    try {
      const { client_id } = request.query;

      const result = await conversationService.getAll(client_id);

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

      const result = await conversationService.getById(id);

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

module.exports = ConversationController;
