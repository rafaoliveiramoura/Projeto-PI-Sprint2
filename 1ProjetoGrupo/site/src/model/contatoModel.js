const database = require("../database/config");

function contato(solicitante, empresa, motivo, email, mensagem) {
    const instrucaoSql = `
        INSERT INTO contato (solicitante, empresa, motivo, email, mensagem) 
        VALUES ('${solicitante}', '${empresa}', '${motivo}', '${email}', '${mensagem}');
    `;
    console.log("Executando a instrução SQL (contato): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    contato
};

