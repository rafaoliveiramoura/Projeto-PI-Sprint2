var database = require("../database/config");

function restaurarConfig(idUsuario, tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco,alertaUmi){
    var instrucaoSQL = `UPDATE configuracoes
        SET temp_min_ideal = ?, temp_max_ideal = ?, temp_alerta_frio = ?, temp_alerta_calor = ?, umid_min_ideal = ?, umid_max_ideal = ?, umid_alerta_seco = ?, umid_alerta_excessiva = ?
        WHERE fkenderecoconfiguracoes = ?;`;
    return database.executar(instrucaoSQL, [tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco, alertaUmi, idUsuario]);
}

module.exports = {
    restaurarConfig
};