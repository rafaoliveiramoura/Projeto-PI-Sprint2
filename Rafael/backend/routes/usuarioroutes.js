const express = require("express")
const expressrouter = express.Router()
const {cadastrar, autenticar, autenticarempresa, cadastrarempresa, validarsenha} = require("../controlers/controlersuser")
let users = []

expressrouter.post("/usuarios/cadastrar", cadastrar)
expressrouter.post("/usuarios/autenticar", autenticar)
expressrouter.post("/empresa/autenticar", autenticarempresa)
expressrouter.post("/empresa/cadastrar", cadastrarempresa)
expressrouter.post("/usuario/validarsenha", validarsenha)


function addUser(user){
    users.push(user);
}
expressrouter.get("/user", (req,res ) =>{
     res.json(users);
})

expressrouter.get("empresa/cadastra", (res) => {
    try {
        res.json(empresas)
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