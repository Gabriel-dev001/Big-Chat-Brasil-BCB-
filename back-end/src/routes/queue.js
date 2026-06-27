const express = require("express");

const routes = express.Router();

const queueController = require("../controllers/queue");
routes.get("/queue-status", queueController.status);

module.exports = routes;
