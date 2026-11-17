const express = require("express");
const router = express.Router();

const coletaMelController = require("../controllers/coletaMelController");

// GET  /coletaMel/listar/1  -> todas as coletas do apiário 1
router.get("/listar/:idEndereco", function (req, res) {
    coletaMelController.listar(req, res);
});

// POST /coletaMel/cadastrar -> { dataServer, quantidadeServer, idEnderecoServer }
router.post("/cadastrar", function (req, res) {
    coletaMelController.cadastrar(req, res);
});

module.exports = router;
