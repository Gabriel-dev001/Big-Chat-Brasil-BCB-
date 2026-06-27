const queueService = require("../service/queue");

class QueueController {
  static async status(request, response) {
    try {
      const result = await queueService.status();

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erro na aplicação, contate o suporte",
      });
    }
  }
}

module.exports = QueueController;
