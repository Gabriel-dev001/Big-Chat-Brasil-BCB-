require("dotenv/config");
const express = require("express");
const cors = require("cors");

const startQueueWorker = require("./worker/queue.worker");
const knex = require("./database/knex");

const app = express();

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

    app.listen(PORT, "0.0.0.0", () => {
      startQueueWorker();
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
