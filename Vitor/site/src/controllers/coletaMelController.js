var coletaMelModel = require("../model/coletaMelModel");

function listar(req, res) {
    var idEndereco = req.params.idEndereco;

    if (idEndereco == undefined || isNaN(idEndereco)) {
        res.status(400).json({ erro: "O apiário informado é inválido!" });
    } else {
        coletaMelModel.listar(idEndereco)
            .then(function (resultado) {
                var coletas = [];

                for (var i = 0; i < resultado.length; i++) {
                    coletas.push({
                        id: resultado[i].id,
                        data: resultado[i].data,
                        ano: resultado[i].ano,
                        quantidade: Number(resultado[i].quantidade)
                    });
                }

                res.json(coletas);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao buscar as coletas." });
            });
    }
}

function dataDeHoje() {
    var hoje = new Date();
    var ano = hoje.getFullYear();
    var mes = hoje.getMonth() + 1;
    var dia = hoje.getDate();

    if (mes < 10) {
        mes = `0${mes}`;
    }
    if (dia < 10) {
        dia = `0${dia}`;
    }

    return `${ano}-${mes}-${dia}`;
}

function cadastrar(req, res) {
    var dataColeta = req.body.dataServer;
    var quantidade = Number(String(req.body.quantidadeServer).replace(",", "."));
    var idEndereco = req.body.idEnderecoServer;

    if (dataColeta == undefined || dataColeta.length != 10) {
        res.status(400).json({ erro: "A data da coleta está inválida!" });
    } else if (dataColeta > dataDeHoje()) {
        res.status(400).json({ erro: "A data da coleta não pode estar no futuro!" });
    } else if (isNaN(quantidade) || quantidade <= 0) {
        res.status(400).json({ erro: "Informe uma quantidade maior que 0 kg!" });
    } else if (idEndereco == undefined || isNaN(idEndereco)) {
        res.status(400).json({ erro: "O apiário informado é inválido!" });
    } else {
        coletaMelModel.cadastrar(dataColeta, quantidade, idEndereco)
            .then(function (resultado) {
                res.status(201).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao salvar a coleta." });
            });
    }
}

module.exports = {
    listar,
    cadastrar
};
