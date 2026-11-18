const database = require("../database/config");

function listar() {
    console.log("Se der erro aqui verifique o bd", email, senha)
    var instrucaoSql = `
        SELECT id, colemia, temeperatura, umidade  FROM users WHERE email = ? AND senha = 
        
        ;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
module.exports = {
    listar
}
