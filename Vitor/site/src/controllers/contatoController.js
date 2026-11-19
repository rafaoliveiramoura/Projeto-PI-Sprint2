var contatoModel = require("../model/contatoModel");

function contato(req, res) {
    var nome = req.body.nomeServer;
    var empresa = req.body.empresaServer;
    var motivo = req.body.motivoContatoServer;
    var email = req.body.emailServer;
    var mensagem = req.body.mensagemContatoServer;

    if (nome == undefined || nome == "") {
        res.status(400).json({ erro: "Seu nome está indefinido!" });
    } else if (empresa == undefined || empresa == "") {
        res.status(400).json({ erro: "Sua empresa está indefinida!" });
    } else if (motivo == undefined || motivo == "") {
        res.status(400).json({ erro: "O motivo do contato está indefinido!" });
    } else if (email == undefined || email.includes("@") == false) {
        res.status(400).json({ erro: "Informe um e-mail válido!" });
    } else if (mensagem == undefined || mensagem == "") {
        res.status(400).json({ erro: "Sua mensagem está indefinida!" });
    } else {
        contatoModel.contato(nome, empresa, motivo, email, mensagem)
            .then(function (resultado) {
                res.status(201).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao enviar o contato." });
            });
    }
}

module.exports = {
    contato
};
