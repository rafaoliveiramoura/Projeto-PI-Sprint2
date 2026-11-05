const contatoModel = require("../model/contatoModel");

function contato(req, res) {
    const nome = String(req.body.nomeServer || '').trim().slice(0, 100);
    const empresa = String(req.body.empresaServer || '').trim().slice(0, 255);
    const motivo = String(req.body.motivoContatoServer || '').trim().slice(0, 50);
    const email = String(req.body.emailServer || '').trim().slice(0, 120);
    const mensagem = String(req.body.mensagemContatoServer || '').trim().slice(0, 1048);

    if (!nome) {
        return res.status(400).send("Seu nome está indefinido!");
    }
    if (!empresa) {
        return res.status(400).send("Sua empresa está indefinida!");
    }
    if (!motivo) {
        return res.status(400).send("O motivo do contato está indefinido!");
    }
    if (!email) {
        return res.status(400).send("Seu e-mail está indefinido!");
    }
    if (!mensagem) {
        return res.status(400).send("Sua mensagem está indefinida!");
    }

    contatoModel.contato(nome, empresa, motivo, email, mensagem)
        .then(function (resultado) {
            res.status(201).json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao registrar contato:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

module.exports = {
    contato
};
