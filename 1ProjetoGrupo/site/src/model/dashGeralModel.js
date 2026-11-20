var database = require("../database/config");

function totalColmeias(idendereco) {
    var instrucaoSql = `
        SELECT total_colmeias_monitoradas
        FROM vw_kpi_apiario_monitorado
        WHERE fkendereco = ?;
    `
    return database.executar(instrucaoSql, [idendereco]);
}
    
   

module.exports = {
    totalColmeias
}
