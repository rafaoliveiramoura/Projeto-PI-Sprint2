var express = require("express");
var router = express.Router();

var coletaMelController = require("../controllers/coletaMelController");

router.get("/listar/:idEndereco", function (req, res) {
    coletaMelController.listar(req, res);
});

router.post("/cadastrar", function (req, res) {
    coletaMelController.cadastrar(req, res);
});

module.exports = router;
