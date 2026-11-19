var usuarioModel = require("../model/usuariomodel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined || email == "") {
        res.status(400).json({ erro: "Seu e-mail está indefinido!" });
    } else if (senha == undefined || senha == "") {
        res.status(400).json({ erro: "Sua senha está indefinida!" });
    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultadoAutenticar) {
                if (resultadoAutenticar.length == 1) {
                    res.json({
                        id: resultadoAutenticar[0].idusuario,
                        email: resultadoAutenticar[0].email,
                        nome: resultadoAutenticar[0].nome,
                        fkcodempresa: resultadoAutenticar[0].fkcodempresa,
                        idEndereco: resultadoAutenticar[0].idendereco
                    });
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).json({ erro: "E-mail e/ou senha inválidos!" });
                } else {
                    res.status(403).json({ erro: "Mais de um usuário com o mesmo login e senha!" });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao realizar o login." });
            });
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cpf = req.body.cpfServer;
    var telefone = req.body.telefoneServer;
    var fkcodempresa = req.body.fkEmpresaServer;

    if (nome == undefined || nome.trim().length < 2) {
        res.status(400).json({ erro: "Informe seu nome (mínimo 2 caracteres)!" });
    } else if (email == undefined || email.includes("@") == false || email.includes(".") == false) {
        res.status(400).json({ erro: "Informe um e-mail válido!" });
    } else if (senha == undefined || senha.length < 8) {
        res.status(400).json({ erro: "A senha deve ter no mínimo 8 caracteres!" });
    } else if (fkcodempresa == undefined || fkcodempresa == "") {
        res.status(400).json({ erro: "O código da empresa está indefinido!" });
    } else {
        usuarioModel.cadastrar(nome, email, senha, cpf, telefone, fkcodempresa)
            .then(function (resultado) {
                res.status(201).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);

                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).json({ erro: "Já existe um usuário com esse e-mail, CPF ou telefone!" });
                } else {
                    res.status(500).json({ erro: "Houve um erro ao realizar o cadastro." });
                }
            });
    }
}

function somenteNumeros(texto) {
    var numeros = "";

    for (var i = 0; i < texto.length; i++) {
        if (texto[i] >= "0" && texto[i] <= "9") {
            numeros += texto[i];
        }
    }

    return numeros;
}

function cadastrarempresa(req, res) {
    var nomeempresa = req.body.nomeempresaVar;
    var razaosocial = req.body.razaosocialempresaVar;
    var codigo = req.body.codigoempresaVar;
    var cnpj = req.body.cnpjVar;
    var telefone = req.body.telefoneVar;
    var emailempresa = req.body.emailempresaVar;

    if (nomeempresa == undefined || nomeempresa == "") {
        res.status(400).json({ erro: "O nome da empresa está indefinido!" });
    } else if (razaosocial == undefined || razaosocial == "") {
        res.status(400).json({ erro: "A razão social está indefinida!" });
    } else if (cnpj == undefined || somenteNumeros(cnpj).length != 14) {
        res.status(400).json({ erro: "O CNPJ precisa ter 14 números!" });
    } else if (emailempresa == undefined || emailempresa.includes("@") == false) {
        res.status(400).json({ erro: "Informe um e-mail válido!" });
    } else if (codigo == undefined || codigo.length != 8) {
        res.status(400).json({ erro: "O código da empresa não foi gerado!" });
    } else {
        usuarioModel.cadastrarempresa(nomeempresa, razaosocial, somenteNumeros(cnpj), emailempresa, telefone, codigo)
            .then(function (resultado) {
                res.status(201).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);

                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).json({ erro: "Já existe uma empresa com esse CNPJ, e-mail ou telefone!" });
                } else {
                    res.status(500).json({ erro: "Houve um erro ao cadastrar a empresa." });
                }
            });
    }
}

function cadastrarendereco(req, res) {
    var cep = req.body.cepServer;
    var rua = req.body.ruaServer;
    var numero = req.body.numeroServer;
    var complemento = req.body.complementoServer;
    var bairro = req.body.bairroServer;
    var cidade = req.body.cidadeServer;
    var estado = req.body.estadoServer;
    var fkEmpresa = req.body.fkEnderecoEmpresa;

    if (cep == undefined || cep == "" || rua == undefined || rua == "" || numero == undefined || numero == "") {
        res.status(400).json({ erro: "Preencha o CEP, a rua e o número!" });
    } else if (complemento == undefined || complemento == "" || bairro == undefined || bairro == "") {
        res.status(400).json({ erro: "Preencha o complemento e o bairro!" });
    } else if (cidade == undefined || cidade == "" || estado == undefined || estado == "") {
        res.status(400).json({ erro: "Preencha a cidade e o estado!" });
    } else if (fkEmpresa == undefined || fkEmpresa == "") {
        res.status(400).json({ erro: "O código da empresa está indefinido!" });
    } else {
        usuarioModel.cadastrarendereco(cep, rua, numero, complemento, bairro, cidade, estado, fkEmpresa)
            .then(function (resultado) {
                res.status(201).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao cadastrar o endereço." });
            });
    }
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarempresa,
    cadastrarendereco
};
