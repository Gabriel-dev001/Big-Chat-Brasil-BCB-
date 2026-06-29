require("dotenv/config");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const startQueueWorker = require("./worker/queue.worker");
const knex = require("./database/knex");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Disponibiliza o io para o resto da aplicação
app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join-conversation", (conversation_id) => {
    socket.join(`conversation:${conversation_id}`);
  });

  socket.on("leave-conversation", (conversation_id) => {
    socket.leave(`conversation:${conversation_id}`);
  });
});

app.use(cors());
app.use(express.json());

app.use(require("./routes/client"));
app.use(require("./routes/conversation"));
app.use(require("./routes/message"));
app.use(require("./routes/queue"));

const PORT = process.env.PORT || 3000;

async function start(retries = 10) {
  try {
    await knex.migrate.latest();
    await knex.seed.run();

    server.listen(PORT, "0.0.0.0", () => {
      startQueueWorker(io);
    });
  } catch (error) {
    console.error(error.message);
    if (retries > 0) {
      setTimeout(() => start(retries - 1), 3000);
    } else {
      process.exit(1);
    }
  }
}

start();

module.exports = { app, io };
