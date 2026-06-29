const queueService = require("../service/queue");

const messageRepository = require("../repository/message");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function processMessage(message, io) {
  try {
    await messageRepository.updateStatus(message.id, "processing");

    // Simula envio
    await sleep(1000);

    // await messageRepository.updateStatus(message.id, "sent");
    await messageRepository.updateStatus(message.id, "delivered");

    if (io) {
      io.to(`conversation:${message.conversation_id}`).emit("message-delivered", {
        ...message,
        status: "delivered",
      });
    }
  } catch (error) {
    await messageRepository.updateStatus(message.id, "failed");
  }
}

function start(io) {
  const run = async () => {
    try {
      const message = queueService.dequeue();

      if (message) {
        await processMessage(message, io);
      }
    } catch (error) {}

    setTimeout(run, 1000);
  };

  run();
}

module.exports = start;
