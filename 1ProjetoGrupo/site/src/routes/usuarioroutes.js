const express = require("express");
const router = express.Router();

const {
    autenticar,
    cadastrar,
    cadastrarempresa,
    cadastrarendereco
} = require("../controllers/controlersuser");

// Rotas de autenticação e cadastros
router.post("/usuarios/autenticar", autenticar);
router.post("/usuarios/cadastrar", cadastrar);
router.post("/empresa/cadastrar", cadastrarempresa);
router.post("/usuarios/cadastrarenderco", cadastrarendereco);

module.exports = router;

