var database = require("../database/config");

function totalColmeias(idEndereco) {
    var instrucaoSql = `
        SELECT total_colmeias_monitoradas
        FROM vw_kpi_apiario_monitorado
        WHERE fkendereco = ?;
    `;
    return database.executar(instrucaoSql, [idEndereco]);
}

function alertas(idEndereco) {
    var instrucaoSql = `
        SELECT idcolmeia, codigo, situacao, inicio, fim,
               em_andamento, duracao_min, temperatura, umidade
        FROM vw_alertas_colmeias
        WHERE fkendereco = ?
        ORDER BY inicio DESC
        LIMIT 500;
    `;
    return database.executar(instrucaoSql, [idEndereco]);
}

function ultimaLeitura(idEndereco) {
    var instrucaoSql = `
        SELECT ultima_leitura
        FROM vw_ultima_leitura
        WHERE fkendereco = ?;
    `;
    return database.executar(instrucaoSql, [idEndereco]);
}

function colmeias(idEndereco) {
    var instrucaoSql = `
        SELECT idcolmeia, codigo, situacao, temp_interna, temp_externa,
               umid_interna, umid_externa, dt_hora
        FROM vw_colmeias_atuais
        WHERE fkendereco = ?
        ORDER BY idcolmeia;
    `;
    return database.executar(instrucaoSql, [idEndereco]);
}

module.exports = {
    totalColmeias,
    alertas,
    ultimaLeitura,
    colmeias
};
