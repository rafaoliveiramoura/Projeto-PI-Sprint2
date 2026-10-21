var express = require("express");
var router = express.Router();

var contatoController = require("../controllers/contatoController.js");

//Recebendo os dados do html 
router.post("/", function (req, res) {
    contatoController.contato(req, res);
})

module.exports = router;