const express = require("express");

const routes = express.Router();

const conversationController = require("../controllers/conversation");

routes.get("/conversations", conversationController.getAll);
routes.get("/conversation", conversationController.getById);

module.exports = routes;
