const http = require('http');
const app = require('./app');


app.set('port', process.env.PORT || 3000);
// Create a server object:
const server = http.createServer(app);

server.listen(process.env.PORT || 3000); // start server


















// const express = require("express")
// const app = express();
// const cors = require("cors");
// const port = 3000

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.post("/api/auth/signup", (req, res) => { 
//     console.log("Signup request:", req.body), 
//     res.send({message: "Utilisateur enregistré" }) })


// app.get('/', (req, res) => res.send("Hello Wordl"));
// app.listen(port, () => console.log("listening on port" + port));
