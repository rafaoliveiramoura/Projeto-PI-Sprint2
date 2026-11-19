var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/controlersuser");

router.post("/usuarios/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/usuarios/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/empresa/cadastrar", function (req, res) {
    usuarioController.cadastrarempresa(req, res);
});

router.post("/usuarios/cadastrarenderco", function (req, res) {
    usuarioController.cadastrarendereco(req, res);
});

module.exports = router;
