const express = require("express");
const router = express.Router();

const contatoController = require("../controllers/contatoController");

router.post("/", function (req, res) {
    contatoController.contato(req, res);
});

module.exports = router;

