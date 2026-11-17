const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const app = express();
const PORTA = process.env.APP_PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// front-end: a pasta Dashboard da Gabriela (index.html = dashboard principal)
app.use(express.static(path.join(__dirname, "../Dashboard")));

// rotas da API
const coletaMelRouter = require("./src/routes/coletaMel");
app.use("/coletaMel", coletaMelRouter);

app.listen(PORTA, function () {
    console.log(`
=============================================================
 Servidor Tetria (Gabriela) rodando em: http://localhost:${PORTA}
 Dashboard:          http://localhost:${PORTA}/index.html
 Histórico do mel:   http://localhost:${PORTA}/historico-mel.html
=============================================================
`);
});
