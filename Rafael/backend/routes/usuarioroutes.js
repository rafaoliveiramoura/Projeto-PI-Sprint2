const express = require("express")
const expressrouter = express.Router()
const {cadastrar, autenticar, autenticarempresa, cadastrarempresa} = require("../controlers/controlersuser")
let users = []

expressrouter.post("/usuarios/cadastrar", cadastrar)
expressrouter.post("/usuarios/autenticar", autenticar)
expressrouter.post("/empresa/autenticar", cadastrarempresa)
expressrouter.post("/empresa/cadastrar", autenticarempresa)


function addUser(user){
    users.push(user);
}
expressrouter.get("/user", (res,resp ) =>{
     res.json(users);
})

module.exports = {
    expressrouter,
    addUser,
    users
}