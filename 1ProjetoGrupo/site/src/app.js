const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.APP_PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir frontend da pasta public
app.use(express.static(path.join(__dirname, "../public")));

// Importação das rotas da API
const usuarioroutes = require("./routes/usuarioroutes");
const contatoroutes = require("./routes/contato");
const dashboardroutes = require("./routes/dashboard");
<<<<<<< HEAD
const coletaMelRouter = require("./routes/coletaMel");
const kpiRouter = require("./routes/kpiteste"); 
=======
const dashGeralRoutes = require("./routes/dashGeral");
const coletaMelRouter = require("./routes/coletaMel");

>>>>>>> 1601ae112cf5226292650cf7b7c701db4cc2b750

// Registro das rotas da API
app.use("/", usuarioroutes);
app.use("/contato", contatoroutes);
app.use("/dashboard", dashboardroutes);
<<<<<<< HEAD
=======
app.use("/dashgeral", dashGeralRoutes);
>>>>>>> 1601ae112cf5226292650cf7b7c701db4cc2b750
app.use("/coletaMel", coletaMelRouter);
app.use("/kpi", kpiRouter);

app.listen(PORT, () => {
    console.log(`
=============================================================
 Servidor Tetria rodando em: http://localhost:${PORT}
 Frontend disponível em:     http://localhost:${PORT}/index.html
=============================================================
       .-""""-.                         ████████╗███████╗████████╗██████╗ ██╗ █████╗
     .'  .--.  '.                       ╚══██╔══╝██╔════╝╚══██╔══╝██╔══██╗██║██╔══██╗
    /   /    \\   \\                         ██║   █████╗     ██║   ██████╔╝██║███████║
   ;   |  🐝  |   ;                        ██║   ██╔══╝     ██║   ██╔══██╗██║██╔══██║
   |    \\    /    |                        ██║   ███████╗   ██║   ██║  ██║██║██║  ██║
   ;     '──'     ;                        ╚═╝   ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
    \\            /
     '.        .'
       '-.__.-'                         M O N I T O R A N D O   C O L M E I A S
=============================================================
`);
});

