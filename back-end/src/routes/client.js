const express = require("express");

const routes = express.Router();

const clientController = require("../controllers/client");
routes.get("/auth", clientController.auth);

routes.get("/clients", clientController.getAll);
routes.get("/client", clientController.getById);
routes.get("/client/balance", clientController.getBalance);
routes.post("/client", clientController.create);
routes.put("/client", clientController.update);

module.exports = routes;
