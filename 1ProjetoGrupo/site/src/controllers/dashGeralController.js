var dashGeralModel = require("../model/dashGeralModel");

function numeroOuNulo(valor) {
    return valor == null ? null : Number(valor);
}

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

function alertas(req, res) {
    var idEndereco = Number(req.params.idEndereco);

    if (!Number.isInteger(idEndereco) || idEndereco <= 0) {
        return res.status(400).send("O apiário informado é inválido!");
    }

    dashGeralModel.alertas(idEndereco)
        .then(function (resultado) {
            var lista = resultado.map(function (linha) {
                return {
                    idcolmeia: linha.idcolmeia,
                    codigo: linha.codigo,
                    situacao: linha.situacao,
                    inicio: linha.inicio,
                    fim: linha.fim,
                    em_andamento: Number(linha.em_andamento),
                    duracao_min: Number(linha.duracao_min),
                    temperatura: Number(linha.temperatura),
                    umidade: Number(linha.umidade)
                };
            });
            res.status(200).json(lista);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function ultimaLeitura(req, res) {
    var idEndereco = Number(req.params.idEndereco);

    if (!Number.isInteger(idEndereco) || idEndereco <= 0) {
        return res.status(400).send("O apiário informado é inválido!");
    }

    dashGeralModel.ultimaLeitura(idEndereco)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json({ ultima_leitura: resultado[0].ultima_leitura });
            } else {
                res.status(200).json({ ultima_leitura: null });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function colmeias(req, res) {
    var idEndereco = Number(req.params.idEndereco);

    if (!Number.isInteger(idEndereco) || idEndereco <= 0) {
        return res.status(400).send("O apiário informado é inválido!");
    }

    dashGeralModel.colmeias(idEndereco)
        .then(function (resultado) {
            var lista = resultado.map(function (linha) {
                return {
                    idcolmeia: linha.idcolmeia,
                    codigo: linha.codigo,
                    situacao: linha.situacao,
                    temp_interna: numeroOuNulo(linha.temp_interna),
                    temp_externa: numeroOuNulo(linha.temp_externa),
                    umid_interna: numeroOuNulo(linha.umid_interna),
                    umid_externa: numeroOuNulo(linha.umid_externa),
                    dt_hora: linha.dt_hora
                };
            });
            res.status(200).json(lista);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

module.exports = {
    totalColmeias,
    alertas,
    ultimaLeitura,
    colmeias
};
