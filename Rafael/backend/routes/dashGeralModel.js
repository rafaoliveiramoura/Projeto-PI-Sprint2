var express = require("express")
var router = express.Router()
let listarcolemia = []

var dashGeralController = require("../controlers/dashGeralController");


router.get("/kpi1", function (req, res) {
    try {
        return console.log(listarcolemia)
        
    } catch (error) {
    
    }
});

router.get("/kpi2", function (req, res) {
    dashGeralController.kpi2(req, res);
});

router.get("/kpi3", function (req, res) {
    dashGeralController.kpi3(req, res);
});


module.exports = router;