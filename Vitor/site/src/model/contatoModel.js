var database = require("../database/config");

function contato(solicitante, empresa, motivo, email, mensagem) {
    var instrucaoSql = `
        INSERT INTO contato (solicitante, empresa, motivo, email, mensagem) VALUES (?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [solicitante, empresa, motivo, email, mensagem]);
}

module.exports = {
    contato
};
