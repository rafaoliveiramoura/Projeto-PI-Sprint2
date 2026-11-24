var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/config/:idEndereco", function (req, res) {
    dashboardController.buscarConfig(req, res);
});

router.put("/config", function (req, res) {
    dashboardController.salvarConfig(req, res);
});

router.get("/colmeias/:idEndereco", function (req, res) {
    dashboardController.listarColmeias(req, res);
});

router.get("/medidas/:idColmeia", function (req, res) {
    dashboardController.medidasDoDia(req, res);
});

router.get("/tempo-real/:idColmeia", function (req, res) {
    dashboardController.ultimasLeituras(req, res);
});

router.get("/leituras/:idEndereco", function (req, res) {
    dashboardController.leiturasDoPeriodo(req, res);
});

module.exports = router;
