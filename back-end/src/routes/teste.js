const express = require("express");

const routes = express.Router();

const testeController = require("../controllers/teste/controller");
routes.get("/", testeController.teste);

module.exports = routes;
