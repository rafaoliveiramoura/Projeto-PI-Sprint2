const express = require("express")
const expressrouter = express.Router()
const {cadastrar, autenticar} = require("../controlers/controlersuser")
let users = []

expressrouter.post("/usuarios/cadastrar", cadastrar)
expressrouter.post("/usuarios/autenticar", autenticar)


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