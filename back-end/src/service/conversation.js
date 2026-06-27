const conversationRepository = require("../repository/conversation");

class ConversationService {
  static async getAll(client_id) {
    if (!client_id) {
      return { error: true, message: "Cliente não encontado" };
    }

    const conversations = await conversationRepository.getAll(client_id);

    return { error: false, conversations };
  }

  static async getById(id) {
    if (!id) {
      return { error: true, message: "Conversa não encontada" };
    }

    const conversation = await conversationRepository.getById(id);

    if (!conversation) {
      return { error: true, message: "Conversa não encontada" };
    }

    return { error: false, conversation };
  }

  static async getByClientRecipient(client_id, recepient_id) {
    if (!client_id || !recepient_id) {
      return { error: true, message: "Conversa não encontada" };
    }

    const conversation = await conversationRepository.getByClientRecipient(client_id, recepient_id);

    if (!conversation) {
      return { error: true, message: "Conversa não encontada" };
    }

    return { error: false, conversation };
  }
}

module.exports = ConversationService;
