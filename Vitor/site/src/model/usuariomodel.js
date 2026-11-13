const database = require("../database/config");

function autenticar(email, senha) {
    const instrucaoSql = `
        SELECT idusuario, nome, email, fkcodempresa 
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL (autenticar): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, cpf, telefone, fkcodempresa) {
    const instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, cpf, telefone, fkcodempresa) 
        VALUES ('${nome}', '${email}', '${senha}', '${cpf}', '${telefone}', '${fkcodempresa}');
    `;
    console.log("Executando a instrução SQL (cadastrar usuario): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarempresa(nomeempresa, razaosocial, cnpj, emailempresa, telefoneempresa, codigoempresa) {
    const instrucaoSql = `
        INSERT INTO empresa (codempresa, nome_fantasia, razao_social, cnpj, email, telefone) 
        VALUES ('${codigoempresa}', '${nomeempresa}', '${razaosocial}', '${cnpj}', '${emailempresa}', '${telefoneempresa}');
    `;
    console.log("Executando a instrução SQL (cadastrar empresa): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarendereco(cep, logradouro, numero, complemento, bairro, cidade, estado, fkenderecoempresa) {
    const instrucaoSql = `
        INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, estado, fkenderecoempresa) 
        VALUES ('${cep}', '${logradouro}', '${numero}', '${complemento}', '${bairro}', '${cidade}', '${estado}', '${fkenderecoempresa}');
    `;
    console.log("Executando a instrução SQL (cadastrar endereco): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarempresa,
    cadastrarendereco
};

