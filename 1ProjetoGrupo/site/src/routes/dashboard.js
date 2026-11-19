var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/config/:idEndereco", function (req, res) {
    dashboardController.buscarConfig(req, res);
});

router.put("/config", function (req, res) {
    dashboardController.salvarConfig(req, res);
});

module.exports = router;
