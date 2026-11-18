const database = require("../database/config");

// lista todas as coletas de um apiário, da mais antiga para a mais recente
function listar(idEndereco) {
    const instrucaoSql = `
        SELECT idcoleta_mel AS id,
               DATE_FORMAT(dt_coleta, '%d/%m/%Y') AS data,
               YEAR(dt_coleta) AS ano,
               quantidade_kg AS quantidade
        FROM coleta_mel
        WHERE fkendereco = ${idEndereco}
        ORDER BY dt_coleta, idcoleta_mel;
    `;
    console.log("Executando a instrução SQL (listar coletas de mel): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// registra uma nova coleta (data no formato AAAA-MM-DD)
function cadastrar(dataColeta, quantidade, idEndereco) {
    const instrucaoSql = `
        INSERT INTO coleta_mel (dt_coleta, quantidade_kg, fkendereco)
        VALUES ('${dataColeta}', ${quantidade}, ${idEndereco});
    `;
    console.log("Executando a instrução SQL (cadastrar coleta de mel): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    cadastrar
};
