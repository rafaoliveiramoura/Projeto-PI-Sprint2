
const { valid } = require("semver");
const database = require("../database/config");

function autenticar(email, senha) {
    console.log("Se der erro aqui verifique o bd", email, senha)
    var instrucaoSql = `
        SELECT id, nome, email FROM users WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function autenticarempres (emailempresa, codigo){
    var instrucaoSql = `SELECT id, nome_fantasia, codEmpresa FROM Empresa WHERE nome_fantasia = '${emailempresa}' AND codEmpresa = '${codigo}'`
    console.log("Executando a instrução SQL de autenticação empresa: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha, cpf, telefone) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, cpf, telefone);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    // e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO Usuario2 (nome, email, senha, cpf, telefone) VALUES ('${nome}', '${email}', '${senha}', '${cpf}', '${telefone}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
};


function cadastrarempres (nomeempresa, emailempresa, telefoneempresa, codigo, cnpj, razaosocial){
    var entre = `INSERT INTO Empresa (nome_fantasia, razao_social, cnpj, email, telefone, codEmpresa) VALUES ('${nomeempresa}', '${razaosocial}', '${cnpj}', '${emailempresa}', '${telefoneempresa}', '${codigo}')`
    console.log("Executando a instrução SQL: \n" + entre)
    return database.executar(entre)
}


function cdastrarenderço(cep, rua, numero, bairro, cidade, estado, fkEmpresa){
    var endereco = `INSERT INTO Endereco (cep, logradouro, numero, bairro, cidade, estado, fkEnderecoEmpresa) VALUES ('${cep}', '${rua}', '${numero}', '${bairro}', '${cidade}', '${estado}', ${fkEmpresa})`
    console.log(`Inserindo o endereço: ${endereco}`)
    return database.executar(endereco);
}
 async function validarsenha(id, email, senha) {
    console.log("Se der erro aqui verifique o bd")
    var instrucaoSql = `
        SELECT id, email, senha FROM users WHERE  email = '${email}'  AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    let resultado = await database.executar(instrucaoSql);
    return (resultado && resultado.length > 0) ? resultado[0].senha : null
    
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarempres,
    validarsenha,
    cdastrarenderço
};