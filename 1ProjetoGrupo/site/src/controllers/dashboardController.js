var dashboardModel = require("../model/dashboardModel");

function buscarConfig(req, res) {
    var idEndereco = req.params.idEndereco;

    dashboardModel.buscarConfig(idEndereco)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(204).send("Nenhuma configuração salva para esse endereço");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function salvarConfig(req, res) {
    var idEndereco = req.body.idEndereco;
    var tempMin = req.body.TempMin;
    var tempMax = req.body.TempMax;
    var alertaFrio = req.body.AlertaFrio;
    var alertaCalor = req.body.AlertaCalor;
    var umiMin = req.body.UmiMin;
    var umiMax = req.body.UmiMax;
    var alertaSeco = req.body.AlertaSeco;
    var alertaUmi = req.body.AlertaUmi;

    if (idEndereco == undefined) {
        res.status(400).send("idEndereco está undefined!");
    } else if (tempMin == undefined || tempMax == undefined || alertaFrio == undefined || alertaCalor == undefined) {
        res.status(400).send("Algum campo de temperatura está undefined!");
    } else if (umiMin == undefined || umiMax == undefined || alertaSeco == undefined || alertaUmi == undefined) {
        res.status(400).send("Algum campo de umidade está undefined!");
    } else {
        dashboardModel.salvarConfig(idEndereco, tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi)
            .then(function (resultado) {
                res.status(200).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro);
            });
    }
}

module.exports = {
    buscarConfig,
    salvarConfig
};