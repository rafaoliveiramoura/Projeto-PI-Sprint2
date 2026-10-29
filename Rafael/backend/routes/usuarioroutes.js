const express = require("express")
const expressrouter = express.Router()
const {cadastrar, autenticar, autenticarempresa, cadastrarempresa, validarsenha, cdastrarenderço} = require("../controlers/controlersuser")
let users = []
let empresa = []

expressrouter.post("/usuarios/cadastrar", cadastrar)
expressrouter.post("/usuarios/autenticar", autenticar)
expressrouter.post("/empresa/autenticar", autenticarempresa)
expressrouter.post("/empresa/cadastrar", cadastrarempresa)
expressrouter.post("/usuario/validarsenha", validarsenha)
expressrouter.post("/usuarios/cadastrarenderco", cdastrarenderço)


function addUser(user){
    users.push(user);
}
expressrouter.get("/user", (req,res ) =>{
     res.json(users);
})

expressrouter.get("empresa/cadastrar", (res) => {
    try {
        empresa.push(empresa)
        res.json(empresa)
    }catch(erro){
        res.status(500).send({erro: "Não foi encontrada nenhuma empresa"})

    }
})


expressrouter.get("/busacar-senha/:email", validarsenha)

module.exports = {
    expressrouter,
    addUser,
    users
}