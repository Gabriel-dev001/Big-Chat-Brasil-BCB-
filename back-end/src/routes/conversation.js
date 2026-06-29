const express = require("express");

const routes = express.Router();

const validate = require("../middlewares/validate");

const conversationController = require("../controllers/conversation");

routes.get("/conversations/:client_id", validate, conversationController.getAll);
routes.get("/conversation/:id", validate, conversationController.getById);
routes.get("/conversation/:client_id/:recipient_id", validate, conversationController.getByClientRecipient);

module.exports = routes;
