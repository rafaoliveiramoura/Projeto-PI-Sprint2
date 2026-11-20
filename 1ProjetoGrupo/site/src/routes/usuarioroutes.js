const express = require("express");
const expressrouter = express.Router();
const { cadastrar, autenticar, autenticarempresa, cadastrarempresa, validarsenha, cdastrarenderço } = require("../controllers/controlersuser.js");

let users = [];
let empresa = [];
let endereco = [];

expressrouter.post("/usuarios/cadastrar", cadastrar);
expressrouter.post("/usuarios/autenticar", autenticar);
expressrouter.post("/empresa/autenticar", autenticarempresa);
expressrouter.post("/empresa/cadastrar", cadastrarempresa);
expressrouter.post("/usuario/validarsenha", validarsenha);
expressrouter.post("/usuarios/cadastrarenderco", cdastrarenderço);

expressrouter.get("/user", (req, res) => {
    res.json(users);
});

expressrouter.get("/empresa/cadastrar", (req, res) => {
    try {
        res.json(empresa);
    } catch (erro) {
        res.status(500).send({ erro: "Não foi encontrada nenhuma empresa" });
    }
});

expressrouter.get("/usuarios/cadastrarenderco", (req, res) => {
    try {
        res.json(endereco);
    } catch (erro) {
        res.status(500).send({ erro: "Não foi encontrado nenhum endereço" });
    }
});

expressrouter.get("/usuario/validarsenha", validarsenha, (req, res) => {
    try {
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ erro: "Erro ao validar senha" });
    }
});

module.exports = expressrouter;
