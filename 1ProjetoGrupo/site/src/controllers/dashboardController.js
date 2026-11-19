var dashboardModel = require("../model/dashboardModel");

function restaurarConfig(req, res){
    var idUsuario = req.body.idUsuario;
    var tempMin = req.body.TempMin;
    var tempMax = req.body.TempMax;
    var alertaFrio = req.body.AlertaFrio;
    var alertaCalor = req.body.AlertaCalor;
    var umiMin = req.body.UmiMin;
    var umiMax = req.body.UmiMax;
    var alertaSeco = req.body.AlertaSeco;
    var alertaUmi = req.body.AlertaUmi;

    dashboardModel.publicar(idUsuario, tempMin, tempMax, alertaFrio, alertaCalor, umiMin, umiMax, alertaSeco,alertaUmi)
        .then(function(resultado){
            res.status(200).json({ linhasAlteradas: resultado.affectedRows});
        })
        .catch(function (erro){
            console.log(erro);
            res.status(500).json(erro);
        })
}

module.exports = {
    restaurarConfig
};