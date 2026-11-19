const path = require("path"); 
  require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const PORT = process.env.APP_PORT || 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "Rafael/login/login.html")))

const {expressrouter: usuariosrouter} = require("./routes/usuarioroutes");
const dashgeralrouter = require("./routes/dashGeralModel");


app.use(usuariosrouter)
app.use("/dashgeral", dashgeralrouter)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}

       .-""""-.                         ████████╗███████╗████████╗██████╗ ██╗ █████╗
     .'  .--.  '.                       ╚══██╔══╝██╔════╝╚══██╔══╝██╔══██╗██║██╔══██╗
    /   /    \\   \\                         ██║   █████╗     ██║   ██████╔╝██║███████║
   ;   |  🐝  |   ;                        ██║   ██╔══╝     ██║   ██╔══██╗██║██╔══██║
   |    \\    /    |                        ██║   ███████╗   ██║   ██║  ██║██║██║  ██║
   ;     '──'     ;                        ╚═╝   ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
    \\            /
     '.        .'
       '-.__.-'                         M O N I T O R A N D O   C O L M E I A S
          /\\
     ____/  \\____
    /            \\
   /   \\      /   \\
  /     \\____/     \\
  \\                /
   \\______________/

                         \\  |  /
                      ----\\ | /----
                         / | \\
                        /  |  \\`);});
