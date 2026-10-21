const path = require("path"); 
  require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const PORT = process.env.APP_PORT || 3333;
const app = express();

app.use(cors());
app.use(express.json());

const {expressrouter} = require("./routes/usuarioroutes")
app.use(expressrouter)

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
