const queueRepository = require("../repository/queue");

class QueueService {
  static normal = [];
  static urgent = [];

  static urgentCounter = 0;

  static enqueue(message) {
    if (!message) {
      return;
    }

    if (message.priority == "normal") {
      this.normal.push(message);
    } else {
      this.urgent.push(message);
    }
  }

  static dequeue() {
    // starvation prevention
    if (this.urgent.length > 0 && this.urgentCounter < 3) {
      this.urgentCounter++;
      return this.urgent.shift();
    }

    if (this.normal.length > 0) {
      this.urgentCounter = 0;
      return this.normal.shift();
    }

    if (this.urgent.length > 0) {
      this.urgentCounter = 1;
      return this.urgent.shift();
    }

    return null;
  }

  static async status() {
    const status = await queueRepository.getStatusMessages();

    return {
      error: false,
      queued: status.queued,
      processing: status.processing,
      sent: status.sent,
      delivered: status.delivered,
      read: status.read,
      failed: status.failed,
      normal: this.normal.length,
      urgent: this.urgent.length,
      total: this.normal.length + this.urgent.length,
    };
  }
}

module.exports = QueueService;
