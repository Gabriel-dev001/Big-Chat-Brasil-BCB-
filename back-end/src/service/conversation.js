const conversationRepository = require("../repository/conversation");

class ConversationService {
  static async getAll(client_id) {
    try {
      if (!client_id) {
        return { error: true, message: "Cliente não encontado" };
      }

      const conversations = await conversationRepository.getAll(client_id);

      return { error: false, conversations };
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
        return { error: true, message: "Conversa não encontada" };
      }

      const conversation = await conversationRepository.getById(id);

      if (!conversation) {
        return { error: true, message: "Conversa não encontada" };
      }

      return { error: false, conversation };
    } catch (error) {
      console.log(error);

      return {
        error: true,
        message: "Erro na aplicação, contate o suporte",
      };
    }
  }
}

module.exports = ConversationService;
