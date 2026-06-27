const express = require("express");

const routes = express.Router();

const validate = require("../middlewares/validate");

const clientController = require("../controllers/client");
routes.post("/auth", clientController.auth);

routes.get("/clients", validate, clientController.getAll);
routes.get("/client/:id", validate, clientController.getById);
routes.get("/client/balance/:id", validate, clientController.getBalance);
routes.post("/client", validate, clientController.create);
routes.put("/client/:id", validate, clientController.update);

module.exports = routes;
