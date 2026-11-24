const database = require("../database/config");


function kpi (){
    var kpiteste =  `select * from kpiteste;`
    return database.executar(kpiteste)
}

module.exports = {
    kpi
}