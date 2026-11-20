const coletaMelModel = require("../model/coletaMelModel");

function listar(req, res) {
    const idEndereco = Number(req.params.idEndereco);

    if (!Number.isInteger(idEndereco) || idEndereco <= 0) {
        return res.status(400).send("O apiário informado é inválido!");
    }

    coletaMelModel.listar(idEndereco)
        .then(function (resultado) {
            // DECIMAL do MySQL chega como texto: converte para número
            const coletas = resultado.map(function (linha) {
                return {
                    id: linha.id,
                    data: linha.data,
                    ano: linha.ano,
                    quantidade: Number(linha.quantidade)
                };
            });
            res.status(200).json(coletas);
        })
        .catch(function (erro) {
            console.error("Erro ao listar coletas de mel:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function cadastrar(req, res) {
    const dataColeta = String(req.body.dataServer || "").trim();
    const quantidade = Number(String(req.body.quantidadeServer || "").replace(",", "."));
    const idEndereco = Number(req.body.idEnderecoServer);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataColeta) || isNaN(new Date(dataColeta + "T00:00:00"))) {
        return res.status(400).send("A data da coleta está inválida!");
    }
    const hoje = new Date().toISOString().slice(0, 10);
    if (dataColeta > hoje) {
        return res.status(400).send("A data da coleta não pode estar no futuro!");
    }
    if (!Number.isFinite(quantidade) || quantidade <= 0 || quantidade > 99999) {
        return res.status(400).send("Informe uma quantidade de mel válida (maior que 0 kg)!");
    }
    if (!Number.isInteger(idEndereco) || idEndereco <= 0) {
        return res.status(400).send("O apiário informado é inválido!");
    }

    coletaMelModel.cadastrar(dataColeta, quantidade.toFixed(2), idEndereco)
        .then(function (resultado) {
            res.status(201).json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao cadastrar coleta de mel:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

module.exports = {
    listar,
    cadastrar
};
