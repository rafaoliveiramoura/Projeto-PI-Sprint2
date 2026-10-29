var usuarioModel = require("../model/usuariomodel");
const {addUser} = require("../routes/usuarioroutes")


function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    if (resultadoAutenticar.length == 1) {
                        res.json({
                            id: resultadoAutenticar[0].id,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            senha: resultadoAutenticar[0].senha,
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


function autenticarempresa(req, res) {
    var emailempresa = req.body.emailempresaVar;
    var codigo = req.body.codigoempresaVar;

    if (emailempresa == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (codigo == undefined) {
        res.status(400).send("Seu codigo não foi gerado");
    } else {
        usuarioModel.autenticar(emailempresa, codigo)
            .then(
                function (resultadoAutenticar) {
                    if (resultadoAutenticar.length == 1) {
                        res.json({
                            id: resultadoAutenticar[0].id,
                            emailempresa: resultadoAutenticar[0].emailempresa,
                            codigo : resultadoAutenticar[0].codigo,
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}



function cadastrarempresa(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nomeempresa = req.body.nomeempresaVar;
    var emailempresa = req.body.emailempresaVar;
    var codigo = req.body.codigoempresaVar;
    var cnpj = req.body.cnpjVar || ""; // Se vier undefined, vira string vazia
    var telefoneempresa = req.body.telefoneVar;
    var razaosocial = req.body.razaosocialempresaVar;

    if (nomeempresa == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (emailempresa == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (telefoneempresa == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else {
        // Removida a validação obrigatória de CPF pois não existe no HTML
        usuarioModel.cadastrarempres(nomeempresa, emailempresa, telefoneempresa, codigo, cnpj, razaosocial)
            .then(
                function (resultadoemprea) {
                    res.json(resultadoemprea);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cpf = req.body.cpfServer || ""; // Se vier undefined, vira string vazia
    let telefone = req.body.telefoneServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("Sua telefone está undefined!");
    } else {
        // Removida a validação obrigatória de CPF pois não existe no HTML
        usuarioModel.cadastrar(nome, email, senha, cpf, telefone)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cdastrarenderço(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var cep = req.body.cepServer;
    var rua = req.body.ruaServer;
    var numero = req.body.numeroServer;
    var bairro = req.body.bairroServer;
    var cidade = req.body.cidadeServer;
    var estado = req.body.estadoServer;
    var fkEmpresa = req.body.fkEnderecoEmpresa;

    if (cep == undefined) {
        res.status(400).send("Seu cep está indefinido!");
    } else if (rua == undefined) {
        res.status(400).send("Sua rua está indefinido!");
    } else if (numero == undefined) {
        res.status(400).send("Seu numero está indefinido!");
    } else if (bairro == undefined) {
        res.status(400).send("Seu bairro está indefinido!");
    } else if (cidade == undefined) {
        res.status(400).send("Sua cidade esta indefinida");
    } else if (estado == undefined) {
        res.status(400).send("Seu estado esta indefinido");
    } else {
        usuarioModel.cdastrarenderço(cep, rua, numero, bairro, cidade, estado, fkEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro do endereço! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

 async function validarsenha (resp,req){
    try{
        const email = req.parms.email
        const senhaBanco = await usuarioModel.validarsenha(email)
        res.json({senha: senhaBanco})
    }catch (erro){
        res.status(500).json({erro: "Erro ao buscar senha no banco"})
    }
}
    
    function listarUsuario (req,res){
        res.json(resultado)
    }

module.exports = {
    autenticar,
    cadastrar,
    cadastrarempresa, 
    autenticarempresa,
    cdastrarenderço,
    validarsenha,
    listarUsuario
}