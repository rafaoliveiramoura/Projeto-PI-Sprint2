const usuarioModel = require("../model/usuariomodel");

function autenticar(req, res) {
    const email = String(req.body.emailServer || '').trim();
    const senha = String(req.body.senhaServer || '');

    if (!email) {
        return res.status(400).send("Seu e-mail está indefinido!");
    }
    if (!senha) {
        return res.status(400).send("Sua senha está indefinida!");
    }

    usuarioModel.autenticar(email, senha)
        .then(function (resultadoAutenticar) {
            if (resultadoAutenticar.length === 1) {
                res.json({
                    id: resultadoAutenticar[0].idusuario,
                    email: resultadoAutenticar[0].email,
                    nome: resultadoAutenticar[0].nome,
                    fkcodempresa: resultadoAutenticar[0].fkcodempresa
                });
            } else if (resultadoAutenticar.length === 0) {
                res.status(403).send("E-mail e/ou senha inválido(s)");
            } else {
                res.status(403).send("Mais de um usuário com o mesmo login e senha!");
            }
        })
        .catch(function (erro) {
            console.error("Erro ao autenticar usuário:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function cadastrar(req, res) {
    const nome = String(req.body.nomeServer || '').trim().slice(0, 45);
    const email = String(req.body.emailServer || '').trim().slice(0, 100);
    const senha = String(req.body.senhaServer || '').slice(0, 45);
    const cpf = String(req.body.cpfServer || '').replace(/\s+/g, '').slice(0, 14);
    const telefone = String(req.body.telefoneServer || '').replace(/\s+/g, '').slice(0, 14);
    const fkcodempresa = String(req.body.fkEmpresaServer || '').trim().slice(0, 8);

    if (!nome) {
        return res.status(400).send("Seu nome está indefinido!");
    }
    if (!email) {
        return res.status(400).send("Seu e-mail está indefinido!");
    }
    if (!senha) {
        return res.status(400).send("Sua senha está indefinida!");
    }
    if (!fkcodempresa) {
        return res.status(400).send("O código da empresa vinculada é obrigatório!");
    }

    usuarioModel.cadastrar(nome, email, senha, cpf, telefone, fkcodempresa)
        .then(function (resultado) {
            res.status(201).json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao cadastrar usuário:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function cadastrarempresa(req, res) {
    const nomeempresa = String(req.body.nomeempresaVar || '').trim().slice(0, 100);
    const razaosocial = String(req.body.razaosocialempresaVar || req.body.nomeempresaVar || '').trim().slice(0, 100);
    const codigo = String(req.body.codigoempresaVar || '').trim().slice(0, 8);
    // No Script.sql, o CNPJ é char(14), armazenando apenas dígitos sem máscara (ex: '12345678000101')
    const cnpj = String(req.body.cnpjVar || '').replace(/\D/g, '').slice(0, 14);
    // No Script.sql, o telefone é char(14) (ex: '(14)98765-0001')
    const telefoneempresa = String(req.body.telefoneVar || '').replace(/\s+/g, '').slice(0, 14);
    const emailempresa = String(req.body.emailempresaVar || '').trim().slice(0, 100);

    if (!nomeempresa) {
        return res.status(400).send("O nome da empresa está indefinido!");
    }
    if (!emailempresa) {
        return res.status(400).send("O e-mail da empresa está indefinido!");
    }
    if (!codigo) {
        return res.status(400).send("O código da empresa não foi gerado!");
    }

    usuarioModel.cadastrarempresa(nomeempresa, razaosocial, cnpj, emailempresa, telefoneempresa, codigo)
        .then(function (resultadoEmpresa) {
            res.status(201).json(resultadoEmpresa);
        })
        .catch(function (erro) {
            console.error("Erro ao cadastrar empresa:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function cadastrarendereco(req, res) {
    // No Script.sql: cep char(9), logradouro varchar(100), numero varchar(45), complemento varchar(45) not null, bairro varchar(50), cidade varchar(50), estado varchar(45), fkenderecoempresa char(8)
    const cep = String(req.body.cepServer || '').trim().slice(0, 9);
    const rua = String(req.body.ruaServer || '').trim().slice(0, 100);
    const numero = String(req.body.numeroServer || '').trim().slice(0, 45);
    const complemento = String(req.body.complementoServer || 'Apiário').trim().slice(0, 45);
    const bairro = String(req.body.bairroServer || '').trim().slice(0, 50);
    const cidade = String(req.body.cidadeServer || '').trim().slice(0, 50);
    const estado = String(req.body.estadoServer || '').trim().slice(0, 45);
    const fkEmpresa = String(req.body.fkEnderecoEmpresa || '').trim().slice(0, 8);

    if (!cep || !rua || !numero || !bairro || !cidade || !estado || !fkEmpresa) {
        return res.status(400).send("Todos os campos de endereço são obrigatórios!");
    }

    usuarioModel.cadastrarendereco(cep, rua, numero, complemento, bairro, cidade, estado, fkEmpresa)
        .then(function (resultado) {
            res.status(201).json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao cadastrar endereço:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarempresa,
    cadastrarendereco
};
