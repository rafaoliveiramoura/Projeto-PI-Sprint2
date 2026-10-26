const express = require("express")
const UsuarioModel = require("../model/usuariomodel")
const expressrouter = express.Router()
const {cadastrar, autenticar, autenticarempresa, cadastrarempresa, validarsenha} = require("../controlers/controlersuser")
let users = []

expressrouter.post("/usuarios/cadastrar", cadastrar)
expressrouter.post("/usuarios/autenticar", autenticar)
expressrouter.post("/empresa/autenticar", cadastrarempresa)
expressrouter.post("/empresa/cadastrar", autenticarempresa)
expressrouter.post("/usuario/validarsenha", validarsenha)


function addUser(user){
    users.push(user);
}
expressrouter.get("/user", (req,res ) =>{
     res.json(users);
})

appendFile.get("/busacar-senha/:email", async (req,res) =>{
    try{
    const email = req.params.email
    const senhabanco = await UsuarioModel.validarsenha(email)
    res.json({senha: senhabanco})
    }
    catch(erro){
        res.status(500).json ({erro: "Erro ao buscar a senha no banco"})

    }
})

module.exports = {
    expressrouter,
    addUser,
    users
}