const clientRepository = require("../repository/client");
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

  static async getByClientRecipient(client_id, recipient_id) {
    if (!client_id || !recipient_id) {
      return { error: true, message: "Conversa não encontada" };
    }

    let conversation = null;

    conversation = await conversationRepository.getByClientRecipient(client_id, recipient_id);

    if (!conversation) {
      conversation = await ConversationService.create(client_id, recipient_id);
    }

    return { error: false, conversation };
  }

  static async create(client_id, recipient_id) {
    if (!client_id || !recipient_id) {
      return { error: true, message: "Conversa não encontada" };
    }

    const recipient = await clientRepository.getById(recipient_id);

    if (!recipient) {
      return { error: true, message: "Recipiente não encontado" };
    }

    const data = { client_id, recipient_id, recipient_name: recipient.name };

    return await conversationRepository.create(data);
  }
}

module.exports = ConversationService;
