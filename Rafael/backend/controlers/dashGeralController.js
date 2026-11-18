
function kpi1(req, res){
    
    let colRisco = {
        temperatura: 10
    }
    res.status(200).json(colRisco);
}


function kpi2(req, res){
    let colAlerta = {
        temperatura: 40
    }
    res.status(200).json(colAlerta);
}

function kpi3(res, req){
    let apiarioMonitorado = {
        qtd_colmeia: 10
    }
    res.status(200).json(apiarioMonitorado);
}

 

module.exports = {
    kpi1,
    kpi2,
    kpi3
}

