const express = require("express");
const router = express.Router();

const contatoController = require("../controlers/contatoController");

router.post("/", function (req, res) {
    contatoController.contato(req, res);
});

module.exports = router;

