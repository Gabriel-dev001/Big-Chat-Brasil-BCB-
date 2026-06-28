const queueService = require("./queue");

const messageRepository = require("../repository/message");
const clientRepository = require("../repository/client");
const conversationRepository = require("../repository/conversation");

class MessageService {
  static async getAll(client_id, content) {
    if (!client_id) {
      return { error: true, message: "Cliente não encontado" };
    }

    const messages = await messageRepository.getAll(client_id, content ? content : null);

    return { error: false, messages };
  }

  static async getById(id) {
    if (!id) {
      return { error: true, message: "Mensagem não encontada" };
    }

    const message = await messageRepository.getById(id);

    if (!message) {
      return { error: true, message: "Mensagem não encontada" };
    }

    return { error: false, message };
  }

  static async getByConversationId(conversation_id) {
    if (!conversation_id) {
      return { error: true, message: "Conversa não encontada" };
    }

    const messages = await messageRepository.getByConversationId(conversation_id);

    if (!messages) {
      return { error: true, message: "Mensagens não encontada" };
    }

    return { error: false, messages };
  }

  static async send({ conversation_id, sender_id, recipient_id, content, priority }) {
    if (!conversation_id || !sender_id || !recipient_id) {
      return { error: true, message: "Conversa não encontada" };
    }

    if (!content) {
      return { error: true, message: "Mensagem não encontada" };
    }

    if (!priority) {
      return { error: true, message: "Prioridade não encontada" };
    }

    if (priority != "normal" && priority != "urgent") {
      return { error: true, message: "Prioridade inválida" };
    }

    const client = await clientRepository.getById(sender_id);

    if (!client) {
      return { error: true, message: "Cliente não encontada" };
    }

    let cost = priority == "normal" ? 0.25 : 0.5;

    if (client.plan_type == "prepaid") {
      if (client.balance == 0.0) {
        return { error: true, message: "Saldo insuficiente" };
      } else {
        await clientRepository.decrementBalence(client.id, cost);
      }
    } else {
      if (client.balance == client.limit) {
        return { error: true, message: "Saldo insuficiente" };
      } else {
        await clientRepository.incrementBalence(client.id, cost);
      }
    }

    let data = { conversation_id, sender_id, recipient_id, content, priority, status: "queued", cost };

    const [message_id] = await messageRepository.send(data);

    const message = await messageRepository.getById(message_id);

    queueService.enqueue(message);

    conversationRepository.updateLastMessage(message.conversation_id, message.content);

    return { error: false, message };
  }

  static async markRead(conversation_id, sender_id) {
    if (!conversation_id || !sender_id) {
      return { error: true, message: "Conversa não encontada" };
    }

    const message = await messageRepository.markRead(conversation_id, sender_id);

    return { error: false, message };
  }
}

module.exports = MessageService;
