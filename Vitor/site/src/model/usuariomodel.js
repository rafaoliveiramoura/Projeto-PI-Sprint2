var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT u.idusuario, u.nome, u.email, u.fkcodempresa,
            (SELECT MIN(e.idendereco) FROM endereco e WHERE e.fkenderecoempresa = u.fkcodempresa) AS idendereco
        FROM usuario u
        WHERE u.email = ? AND u.senha = ?;
    `;
    return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha, cpf, telefone, fkcodempresa) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, cpf, telefone, fkcodempresa) VALUES (?, ?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [nome, email, senha, cpf, telefone, fkcodempresa]);
}

function cadastrarempresa(nomeempresa, razaosocial, cnpj, emailempresa, telefoneempresa, codigoempresa) {
    var instrucaoSql = `
        INSERT INTO empresa (codempresa, nome_fantasia, razao_social, cnpj, email, telefone) VALUES (?, ?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [codigoempresa, nomeempresa, razaosocial, cnpj, emailempresa, telefoneempresa]);
}

function cadastrarendereco(cep, logradouro, numero, complemento, bairro, cidade, estado, fkenderecoempresa) {
    var instrucaoSql = `
        INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, estado, fkenderecoempresa) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [cep, logradouro, numero, complemento, bairro, cidade, estado, fkenderecoempresa]);
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarempresa,
    cadastrarendereco
};
