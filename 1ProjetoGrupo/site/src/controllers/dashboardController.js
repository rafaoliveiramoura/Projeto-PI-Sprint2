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

// GET /dashboard/colmeias/:idEndereco -> última leitura de cada colmeia + do sensor externo
function listarColmeias(req, res) {
    var idEndereco = req.params.idEndereco;

    Promise.all([
        dashboardModel.listarColmeias(idEndereco),
        dashboardModel.ultimaLeituraExterna(idEndereco)
    ])
        .then(function (resultados) {
            res.status(200).json({
                colmeias: resultados[0],
                externo: resultados[1][0] || null
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

// GET /dashboard/medidas/:idColmeia?data=YYYY-MM-DD -> leituras do dia (interna e externa)
function medidasDoDia(req, res) {
    var idColmeia = req.params.idColmeia;
    var data = req.query.data;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) {
        res.status(400).send("Informe a data no formato YYYY-MM-DD");
        return;
    }

    dashboardModel.medidasDoDia(idColmeia, data)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

// GET /dashboard/tempo-real/:idColmeia?limite=30 -> últimas leituras sem agrupar (gráfico ao vivo)
function ultimasLeituras(req, res) {
    var idColmeia = req.params.idColmeia;
    var limite = Number(req.query.limite) || 30;
    limite = Math.min(Math.max(limite, 1), 300);

    dashboardModel.ultimasLeituras(idColmeia, limite)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

// GET /dashboard/leituras/:idEndereco?dias=7 -> leituras do período para montar o histórico de alertas
function leiturasDoPeriodo(req, res) {
    var idEndereco = req.params.idEndereco;
    var dias = Number(req.query.dias) || 7;
    dias = Math.min(Math.max(dias, 1), 366);

    dashboardModel.leiturasDoPeriodo(idEndereco, dias)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

module.exports = {
    buscarConfig,
    salvarConfig,
    listarColmeias,
    medidasDoDia,
    ultimasLeituras,
    leiturasDoPeriodo
};