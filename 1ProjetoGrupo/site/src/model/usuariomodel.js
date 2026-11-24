
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


function cadastrar(nome, email, senha, cpf, telefone) {
    console.log("ACESSO O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, cpf, telefone);

    // Cadasatrando o admin da empresa
    var instrucaoSql = `
        INSERT INTO users (nome, email, senha, cpf, telefone) VALUES ('${nome}', '${email}', '${senha}', '${cpf}', '${telefone}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
};

//Cadastro das empresas
function cadastrarempres (nomeempresa, emailempresa, telefoneempresa, codigo, cnpj, razaosocial){
    var entre = `INSERT INTO empresa (codempresa, nome_fantasia, razao_social, cnpj, email, telefone) VALUES ('${codigo}', '${nomeempresa}', '${razaosocial}', '${cnpj}', '${emailempresa}', '${telefoneempresa}')`
    console.log("Executando a instrução SQL: \n" + entre)
    return database.executar(entre)
}

//cadastro do endereço
function cdastrarenderço(cep, rua, numero, bairro, cidade, estado, fkEmpresa){
    var endereco = `INSERT INTO endereco (cep, logradouro, numero, bairro, cidade, estado, fkEnderecoEmpresa) VALUES ('${cep}', '${rua}', '${numero}', '${bairro}', '${cidade}', '${estado}', ${fkEmpresa})`
    console.log(`Inserindo o endereço: ${endereco}`)
    return database.executar(endereco);
}
 async function validarsenha(id, email, senha) {
    console.log("Se der erro aqui verifique o bd")
    var instrucaoSql = `
        SELECT id, email, senha FROM users WHERE  email = '${email}'  AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    if (resultado && resultado.length > 0){
        let usuario = resultado[0]
        return {
            id: usuario.id,
            email: usuario.email,
            senha: usuario.senha
        }
    }
    else {
        console.error("Usuario não encotrado no BD")
    }
   
    
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarempres,
    validarsenha,
    cdastrarenderço,
    autenticarempres
};