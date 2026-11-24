var express = require("express");
var router = express.Router();
var dashboardController = require("../model/kpicontrol");

router.get("/kpi-total", function (req, res) {
    dashboardController.obterKpi(req, res);
});

module.exports = router;