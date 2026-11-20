var express = require("express");
var router = express.Router();

var dashGeralController = require("../controllers/dashGeralController");

router.get("/total-colmeias/:idEndereco", function (req, res) {
    dashGeralController.totalColmeias(req, res);
});

router.get("/alertas/:idEndereco", function (req, res) {
    dashGeralController.alertas(req, res);
});

router.get("/ultima-leitura/:idEndereco", function (req, res) {
    dashGeralController.ultimaLeitura(req, res);
});

router.get("/colmeias/:idEndereco", function (req, res) {
    dashGeralController.colmeias(req, res);
});

module.exports = router;
