var dashboardModel = require("../model/kpiteste"); // Use "./kpiteste" se o kpicontrol.js estiver dentro da pasta model

function obterKpi(req, res) {
    dashboardModel.kpi()
        .then(function (resultado) {
            if (resultado.length > 0) {
                // Pega a string "Desativado" independente do nome da coluna da view
                const texto = resultado.statussensor || resultado.statuss || Object.values(resultado);
                res.status(200).json({ kpi: texto });
            } else {
                res.status(204).send("Nenhum resultado encontrado");
            }
        })
        .catch(function (erro) {
            console.log("Erro ao buscar KPI:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    obterKpi
};
