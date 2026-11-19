var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.put("/config", function (req, res) {
    dashboardController.restaurarConfig(req, res);
});

module.exports = router;