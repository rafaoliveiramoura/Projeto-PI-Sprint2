var express = require("express");
var router = express.Router();

var contatoController = require("../controllers/contatoController");

router.post("/", function (req, res) {
    contatoController.contato(req, res);
});

module.exports = router;
