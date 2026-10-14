var database = require("../database/config")

function contato(nome, empresa, motivo, email, mensagem) {
    console.log("ACESSEI O CONTATO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente.> function contato:", nome, empresa, motivo, email, mensagem);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO contato (solicitante, empresa, motivo, email, mensagem) VALUES ('${nome}', '${empresa}','${motivo}', '${email}', '${mensagem}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    contato
};