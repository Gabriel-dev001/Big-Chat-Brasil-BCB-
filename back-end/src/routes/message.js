const express = require("express");

const routes = express.Router();

const validate = require("../middlewares/validate");

const messageController = require("../controllers/message");

routes.get("/messages/:client_id", validate, messageController.getAll);
routes.get("/message/:id", validate, messageController.getById);
routes.get("/message/conversation/:conversation_id", validate, messageController.getByConversationId);
routes.post("/message", validate, messageController.send);
routes.put("/message/mark-read", validate, messageController.markRead);

module.exports = routes;
