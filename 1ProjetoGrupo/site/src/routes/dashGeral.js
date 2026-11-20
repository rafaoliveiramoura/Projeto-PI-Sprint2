var express = require("express")
var router = express.Router()

var dashGeralController = require("../controllers/dashGeralController");

router.get("/total-colmeias/:idEndereco", function (req, res) {     dashGeralController.totalColmeias(req, res);
});

module.exports = router;