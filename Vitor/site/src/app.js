var caminho_env = ".env";

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");

var PORTA_APP = process.env.APP_PORT;

var app = express();

var usuarioRouter = require("./routes/usuarioroutes");
var contatoRouter = require("./routes/contato");
var dashboardRouter = require("./routes/dashboard");
var coletaMelRouter = require("./routes/coletaMel");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use(cors());

app.use("/", usuarioRouter);
app.use("/contato", contatoRouter);
app.use("/dashboard", dashboardRouter);
app.use("/coletaMel", coletaMelRouter);

app.listen(PORTA_APP, function () {
    console.log(`
    =============================================================
     Servidor Tetria rodando! Acesse: http://localhost:${PORTA_APP}
    =============================================================
           .-""""-.
         .'  .--.  '.        T E T R I A
        /   /    \   \
       ;   |  🐝  |   ;      M O N I T O R A N D O   C O L M E I A S
       |    \    /    |
        '.        .'
          '-.__.-'
    `);
});
