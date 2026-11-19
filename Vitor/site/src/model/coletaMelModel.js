var database = require("../database/config");

function listar(idEndereco) {
    var instrucaoSql = `
        SELECT idcoleta_mel AS id,
               DATE_FORMAT(dt_coleta, '%d/%m/%Y') AS data,
               YEAR(dt_coleta) AS ano,
               quantidade_kg AS quantidade
        FROM coleta_mel
        WHERE fkendereco = ?
        ORDER BY dt_coleta, idcoleta_mel;
    `;
    return database.executar(instrucaoSql, [idEndereco]);
}

function cadastrar(dataColeta, quantidade, idEndereco) {
    var instrucaoSql = `
        INSERT INTO coleta_mel (dt_coleta, quantidade_kg, fkendereco) VALUES (?, ?, ?);
    `;
    return database.executar(instrucaoSql, [dataColeta, quantidade, idEndereco]);
}

module.exports = {
    listar,
    cadastrar
};
