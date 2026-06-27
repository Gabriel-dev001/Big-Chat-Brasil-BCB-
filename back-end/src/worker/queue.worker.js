const queueService = require("../service/queue");

const messageRepository = require("../repository/message");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function processMessage(message) {
  try {
    await messageRepository.updateStatus(message.id, "processing");

    // Simula envio
    await sleep(1000);

    // await messageRepository.updateStatus(message.id, "sent");
    await messageRepository.updateStatus(message.id, "delivered");
  } catch (error) {
    await messageRepository.updateStatus(message.id, "failed");
  }
}

function start() {
  const run = async () => {
    try {
      const message = queueService.dequeue();

      if (message) {
        await processMessage(message);
      }
    } catch (error) {}

    setTimeout(run, 1000);
  };

  run();
}

module.exports = start;
