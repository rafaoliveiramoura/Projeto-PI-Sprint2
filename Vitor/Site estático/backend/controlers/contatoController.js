var contatoModel = require("../model/contatoModel");

function contato(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var empresa = req.body.empresaServer;
    var motivoContato = req.body.motivoContatoServer;
    var email = req.body.emailServer;
    var mensagem = req.body.mensagemContatoServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (empresa == undefined) {
        res.status(400).send("Sua empresa está undefined!");
    } else if (motivoContato == undefined) {
        res.status(400).send("Seu motivo está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (mensagem == undefined) {
        res.status(400).send("Sua mensagem está undefined!")
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        contatoModel.contato(nome, empresa, motivoContato, email, mensagem)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar ao pegar as informações enviadas para contato! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    contato
}