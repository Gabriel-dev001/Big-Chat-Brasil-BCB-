const messageRepository = require("../repository/message");

class MessageService {
  static async getAll(client_id, content) {
    try {
      if (!client_id) {
        return { error: true, message: "Cliente não encontado" };
      }

      const messages = await messageRepository.getAll(
        client_id,
        content ? content : null,
      );

      return { error: false, messages };
    } catch (error) {
      console.log(error);

      return {
        error: true,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }

  static async getById(id) {
    try {
      if (!id) {
        return { error: true, message: "Mensagem não encontada" };
      }

      const message = await messageRepository.getById(id);

      if (!message) {
        return { error: true, message: "Mensagem não encontada" };
      }

      return { error: false, message };
    } catch (error) {
      console.log(error);

      return {
        error: true,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }

  static async getByConversationId(conversation_id) {
    try {
      if (!conversation_id) {
        return { error: true, message: "Conversa não encontada" };
      }

      const messages = await messageRepository.getByConversationId(conversation_id);

      if (!messages) {
        return { error: true, message: "Mensagens não encontada" };
      }

      return { error: false, messages };
    } catch (error) {
      console.log(error);

      return {
        error: true,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }
}

module.exports = MessageService;
