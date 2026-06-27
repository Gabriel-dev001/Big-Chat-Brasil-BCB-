const messageService = require("../service/message");

class MessageController {
  static async getAll(request, response) {
    try {
      const { client_id } = request.params;

      const { content } = request.body;

      const result = await messageService.getAll(client_id, content);

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

      const result = await messageService.getById(id);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async getByConversationId(request, response) {
    try {
      const { conversation_id } = request.params;

      const result = await messageService.getByConversationId(conversation_id);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async send(request, response) {
    try {
      const { conversation_id, sender_id, recipient_id, content, priority } = request.body;

      const result = await messageService.send({
        conversation_id,
        sender_id,
        recipient_id,
        content,
        priority,
      });

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }

  static async markRead(request, response) {
    try {
      const { conversation_id, sender_id } = request.body;

      const result = await messageService.markRead(conversation_id, sender_id);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }
}

module.exports = MessageController;
