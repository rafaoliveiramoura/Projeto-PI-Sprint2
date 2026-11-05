const mysql = require("mysql2");

const mysqlconfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_DATABASE || 'tetria',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'urubu100',
    port: process.env.DB_PORT || 3306
};

function executar(instrucao) {
    const ambiente = process.env.AMBIENTE_PROCESSO || "desenvolvimento";

    if (ambiente !== "producao" && ambiente !== "desenvolvimento") {
        console.log("\nO AMBIENTE NÃO FOI DEFINIDO EM .env\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {
        const conexao = mysql.createConnection(mysqlconfig);
        
        conexao.connect(function(err) {
            if (err) {
                console.error("Erro ao conectar no MySQL:", err.message);
                reject(err);
                return;
            }

            conexao.query(instrucao, function (erro, resultados) {
                conexao.end();
                if (erro) {
                    console.error("Erro na instrução SQL:", erro.sqlMessage || erro.message);
                    reject(erro);
                    return;
                }
                resolve(resultados);
            });
        });

        conexao.on('error', function (erro) {
            console.error("ERRO NO MySQL SERVER: ", erro.sqlMessage || erro.message);
        });
    });
}

module.exports = {
    executar
};

