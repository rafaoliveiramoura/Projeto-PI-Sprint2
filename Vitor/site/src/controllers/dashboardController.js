var dashboardModel = require("../model/dashboardModel");

function buscarConfig(req, res) {
    var idEndereco = req.params.idEndereco;

    dashboardModel.buscarConfig(idEndereco)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado[0]);
            } else {
                res.status(204).send();
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao buscar as configurações." });
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
        res.status(400).json({ erro: "O apiário está indefinido!" });
    } else if (tempMin == undefined || tempMax == undefined || alertaFrio == undefined || alertaCalor == undefined) {
        res.status(400).json({ erro: "Preencha todos os campos de temperatura!" });
    } else if (umiMin == undefined || umiMax == undefined || alertaSeco == undefined || alertaUmi == undefined) {
        res.status(400).json({ erro: "Preencha todos os campos de umidade!" });
    } else {
        dashboardModel.buscarConfig(idEndereco)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    return dashboardModel.atualizarConfig(idEndereco, tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi);
                } else {
                    return dashboardModel.inserirConfig(idEndereco, tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi);
                }
            })
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao salvar as configurações." });
            });
    }
}

function listarColmeias(req, res) {
    var idEndereco = req.params.idEndereco;

    if (idEndereco == undefined || isNaN(idEndereco)) {
        res.status(400).json({ erro: "O apiário informado é inválido!" });
    } else {
        dashboardModel.listarColmeias(idEndereco)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao buscar as colmeias." });
            });
    }
}

function listarLeituras(req, res) {
    var idEndereco = req.params.idEndereco;

    if (idEndereco == undefined || isNaN(idEndereco)) {
        res.status(400).json({ erro: "O apiário informado é inválido!" });
    } else {
        dashboardModel.listarLeituras(idEndereco)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao buscar as leituras." });
            });
    }
}

module.exports = {
    buscarConfig,
    salvarConfig,
    listarColmeias,
    listarLeituras
};
