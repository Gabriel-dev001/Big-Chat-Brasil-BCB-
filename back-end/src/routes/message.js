const express = require("express");

const routes = express.Router();

const messageController = require("../controllers/messsage");

routes.get("/messages", messageController.getAll);
routes.get("/message", messageController.getById);
routes.get("/message/conversation", messageController.getByConversationId);

module.exports = routes;
