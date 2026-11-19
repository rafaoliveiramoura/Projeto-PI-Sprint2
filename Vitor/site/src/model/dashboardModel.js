var database = require("../database/config");

function buscarConfig(idEndereco) {
    var instrucaoSql = `
        SELECT * FROM configuracoes WHERE fkenderecoconfiguracoes = ?;
    `;
    return database.executar(instrucaoSql, [idEndereco]);
}

function atualizarConfig(idEndereco, tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi) {
    var instrucaoSql = `
        UPDATE configuracoes SET
            temp_min_ideal = ?, temp_max_ideal = ?, temp_alerta_frio = ?, temp_alerta_calor = ?,
            umid_min_ideal = ?, umid_max_ideal = ?, umid_alerta_seco = ?, umid_alerta_excessiva = ?
        WHERE fkenderecoconfiguracoes = ?;
    `;
    return database.executar(instrucaoSql, [tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi, idEndereco]);
}

function inserirConfig(idEndereco, tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi) {
    var instrucaoSql = `
        INSERT INTO configuracoes (temp_min_ideal, temp_max_ideal, temp_alerta_frio, temp_alerta_calor,
            umid_min_ideal, umid_max_ideal, umid_alerta_seco, umid_alerta_excessiva, fkenderecoconfiguracoes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi, idEndereco]);
}

function listarColmeias(idEndereco) {
    var instrucaoSql = `
        SELECT c.idcolmeia, c.codigo, c.localizacao,
            (SELECT cd.temperatura FROM coleta_dados cd JOIN sensor s ON cd.fksensor = s.idsensor
              WHERE s.fkcolmeia = c.idcolmeia ORDER BY cd.dt_hora DESC LIMIT 1) AS temperatura,
            (SELECT cd.umidade FROM coleta_dados cd JOIN sensor s ON cd.fksensor = s.idsensor
              WHERE s.fkcolmeia = c.idcolmeia ORDER BY cd.dt_hora DESC LIMIT 1) AS umidade
        FROM colmeia c
        WHERE c.fkendereco = ? AND c.statuss = 1
        ORDER BY c.idcolmeia;
    `;
    return database.executar(instrucaoSql, [idEndereco]);
}

function listarLeituras(idEndereco) {
    var instrucaoSql = `
        SELECT s.fkcolmeia AS idcolmeia, s.tiposensor, cd.temperatura, cd.umidade, cd.dt_hora
        FROM coleta_dados cd
        JOIN sensor s ON cd.fksensor = s.idsensor
        LEFT JOIN colmeia c ON s.fkcolmeia = c.idcolmeia
        WHERE (c.fkendereco = ? OR s.fkendereco_sexterno = ?)
        ORDER BY cd.dt_hora;
    `;
    return database.executar(instrucaoSql, [idEndereco, idEndereco]);
}

module.exports = {
    buscarConfig,
    atualizarConfig,
    inserirConfig,
    listarColmeias,
    listarLeituras
};
