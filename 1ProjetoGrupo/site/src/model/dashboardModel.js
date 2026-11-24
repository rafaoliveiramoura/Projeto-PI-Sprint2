var database = require("../database/config");

// tamanho de cada "bloco" de leituras (em segundos) usado nos gráficos e nos alertas.
// o sensor grava a cada poucos segundos; agrupando em blocos de 10 min o gráfico fica legível.
var SEGUNDOS_POR_BLOCO = 600;

function buscarConfig(idEndereco) {
    var instrucaoSQL = `SELECT * FROM configuracoes WHERE fkenderecoconfiguracoes = ?;`;
    return database.executar(instrucaoSQL, [idEndereco]);
}

function salvarConfig(idEndereco, tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi) {
    return buscarConfig(idEndereco).then(function (resultado) {
        if (resultado.length > 0) {
            var instrucaoUpdate = `UPDATE configuracoes SET
                temp_min_ideal = ?, temp_max_ideal = ?, temp_alerta_frio = ?, temp_alerta_calor = ?,
                umid_min_ideal = ?, umid_max_ideal = ?, umid_alerta_seco = ?, umid_alerta_excessiva = ?
                WHERE fkenderecoconfiguracoes = ?;`;
            return database.executar(instrucaoUpdate, [
                tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi, idEndereco
            ]);
        } else {
            var instrucaoInsert = `INSERT INTO configuracoes
                (temp_min_ideal, temp_max_ideal, temp_alerta_frio, temp_alerta_calor, umid_min_ideal, umid_max_ideal, umid_alerta_seco, umid_alerta_excessiva, fkenderecoconfiguracoes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            return database.executar(instrucaoInsert, [
                tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi, idEndereco
            ]);
        }
    });
}

// todas as colmeias do apiário com a última leitura do sensor interno de cada uma
function listarColmeias(idEndereco) {
    var instrucaoSQL = `
        SELECT c.idcolmeia, c.codigo, s.idsensor,
               cd.temperatura, cd.umidade,
               DATE_FORMAT(cd.dt_hora, '%Y-%m-%dT%H:%i:%s') AS dt_hora
          FROM colmeia c
          LEFT JOIN sensor s
                 ON s.fkcolmeia = c.idcolmeia AND s.tiposensor = 'interno'
          LEFT JOIN coleta_dados cd
                 ON cd.fksensor = s.idsensor
                AND cd.idcoleta = (SELECT MAX(ult.idcoleta) FROM coleta_dados ult WHERE ult.fksensor = s.idsensor)
         WHERE c.fkendereco = ?
         ORDER BY c.idcolmeia;`;
    return database.executar(instrucaoSQL, [idEndereco]);
}

// última leitura do sensor externo do apiário
function ultimaLeituraExterna(idEndereco) {
    var instrucaoSQL = `
        SELECT cd.temperatura, cd.umidade,
               DATE_FORMAT(cd.dt_hora, '%Y-%m-%dT%H:%i:%s') AS dt_hora
          FROM sensor s
          JOIN coleta_dados cd ON cd.fksensor = s.idsensor
         WHERE s.fkendereco_sexterno = ? AND s.tiposensor = 'externo'
         ORDER BY cd.idcoleta DESC
         LIMIT 1;`;
    return database.executar(instrucaoSQL, [idEndereco]);
}

// leituras de um dia (YYYY-MM-DD) da colmeia + sensor externo do mesmo apiário, em blocos de 10 min
function medidasDoDia(idColmeia, data) {
    var instrucaoSQL = `
        SELECT s.tiposensor AS tipo,
               DATE_FORMAT(FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(cd.dt_hora) / ?) * ?), '%H:%i') AS horario,
               ROUND(AVG(cd.temperatura), 1) AS temperatura,
               ROUND(AVG(cd.umidade), 0)     AS umidade,
               MAX(cd.temperatura) AS temp_max,
               MIN(cd.temperatura) AS temp_min,
               MAX(cd.umidade)     AS umid_max,
               MIN(cd.umidade)     AS umid_min
          FROM coleta_dados cd
          JOIN sensor s ON s.idsensor = cd.fksensor
         WHERE (s.fkcolmeia = ?
                OR s.fkendereco_sexterno = (SELECT c.fkendereco FROM colmeia c WHERE c.idcolmeia = ?))
           AND cd.dt_hora >= ?
           AND cd.dt_hora < DATE_ADD(?, INTERVAL 1 DAY)
         GROUP BY tipo, horario
         ORDER BY horario;`;
    return database.executar(instrucaoSQL, [
        SEGUNDOS_POR_BLOCO, SEGUNDOS_POR_BLOCO, idColmeia, idColmeia, data, data
    ]);
}

// últimas N leituras (sem agrupar) do sensor interno da colmeia, cada uma com a leitura
// externa mais próxima do mesmo instante -> gráfico em tempo real
function ultimasLeituras(idColmeia, limite) {
    var instrucaoSQL = `
        SELECT DATE_FORMAT(i.dt_hora, '%H:%i:%s') AS horario,
               i.temperatura, i.umidade,
               (SELECT e.temperatura FROM coleta_dados e
                 WHERE e.fksensor = se.idsensor AND e.dt_hora <= DATE_ADD(i.dt_hora, INTERVAL 1 SECOND)
                 ORDER BY e.idcoleta DESC LIMIT 1) AS temp_externa,
               (SELECT e.umidade FROM coleta_dados e
                 WHERE e.fksensor = se.idsensor AND e.dt_hora <= DATE_ADD(i.dt_hora, INTERVAL 1 SECOND)
                 ORDER BY e.idcoleta DESC LIMIT 1) AS umid_externa
          FROM coleta_dados i
          JOIN sensor s   ON s.idsensor = i.fksensor AND s.tiposensor = 'interno'
          JOIN colmeia c  ON c.idcolmeia = s.fkcolmeia
          LEFT JOIN sensor se ON se.fkendereco_sexterno = c.fkendereco AND se.tiposensor = 'externo'
         WHERE s.fkcolmeia = ?
         ORDER BY i.idcoleta DESC
         LIMIT ?;`;
    return database.executar(instrucaoSQL, [idColmeia, limite]).then(function (linhas) {
        return linhas.reverse(); // mais antiga primeiro (ordem do gráfico)
    });
}

// leituras de todas as colmeias do apiário nos últimos N dias, em blocos de 10 min (para o histórico de alertas)
function leiturasDoPeriodo(idEndereco, dias) {
    var instrucaoSQL = `
        SELECT s.fkcolmeia AS idcolmeia,
               DATE_FORMAT(FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(cd.dt_hora) / ?) * ?), '%Y-%m-%dT%H:%i:00') AS bloco,
               ROUND(AVG(cd.temperatura), 1) AS temperatura,
               ROUND(AVG(cd.umidade), 0)     AS umidade
          FROM coleta_dados cd
          JOIN sensor s  ON s.idsensor = cd.fksensor AND s.tiposensor = 'interno'
          JOIN colmeia c ON c.idcolmeia = s.fkcolmeia
         WHERE c.fkendereco = ?
           AND cd.dt_hora >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY idcolmeia, bloco
         ORDER BY idcolmeia, bloco;`;
    return database.executar(instrucaoSQL, [SEGUNDOS_POR_BLOCO, SEGUNDOS_POR_BLOCO, idEndereco, dias]);
}

module.exports = {
    buscarConfig,
    salvarConfig,
    listarColmeias,
    ultimaLeituraExterna,
    medidasDoDia,
    ultimasLeituras,
    leiturasDoPeriodo
};
