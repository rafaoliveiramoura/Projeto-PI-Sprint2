var database = require("../database/config");

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

module.exports = {
    buscarConfig,
    salvarConfig
};