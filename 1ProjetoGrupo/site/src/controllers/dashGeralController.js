var dashGeralModel = require("../model/dashGeralModel");

function totalColmeias(req, res) {
    var idEndereco = Number(req.params.idEndereco);

    if (!Number.isInteger(idEndereco) || idEndereco <= 0) {
        return res.status(400).send("O apiário informado é inválido!");
    }

    dashGeralModel.totalColmeias(idEndereco)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(200).json({ total_colmeias_monitoradas: 0 });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}


function kpi2(req, res){
    let colAlerta = {
        temperatura: 40
    }
    res.status(200).json(colAlerta);
}

function kpi3(res, req){
    let apiarioMonitorado = {
        qtd_colmeia: 10
    }
    res.status(200).json(apiarioMonitorado);
}

 

module.exports = {
    totalColmeias,
    kpi2,
    kpi3
}

