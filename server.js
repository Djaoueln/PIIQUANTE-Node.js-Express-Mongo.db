require('dotenv').config();
const express = require("express")
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const port = 3000;
const bcrypt = require('bcrypt');
console.log("Environement", process.env.DB_PASSWORD);

//Connexion à MongoDB
const password = process.env.DB_PASSWORD;
const userName = process.env.DB_USERNAME;

mongoose.connect(`mongodb+srv://${userName}:${password}@cluster0.wgzwom8.mongodb.net/?retryWrites=true&w=majority`).then(() => {console.log('Connexion à MongoDB réussie !')}).catch(() => {console.log('Connexion à MongoDB échouée !')});

//Schema
 const userSchema = mongoose.Schema({
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true }
 });
//Model
const User = mongoose.model('User', userSchema);
//Instance

 

  //Middleware
 app.use(cors());
 app.use(express.json());

 // Routes
 app.post("/api/auth/signup", createUserData);
 app.post("/api/auth/login", loginUser);
     

app.get('/', (req, res) => res.send("Hello Wordl"));
app.listen(port, () => console.log("listening on port" + port));


async function createUserData(req, res) {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  console.log("password", password);
  console.log("hashedPassword", hashedPassword);
  //Create user
  const user = new User({ email, password: hashedPassword});


 
  //Save
  user
  .save()
  .then(() => res.send({message: "Utilisateur enregistré" }))
  .catch(error => {console.log('Erreur : ', error)});
}

//Hash password
function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

function loginUser (req, res) {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (user) {
      bcrypt.compare(password, user.password).then(samePassword => {
        if (samePassword) {
          res.send({ message: "Connexion réussie" });
        } else {
          res.send({ message: "Mot de passe incorrect" });
        }
      });
    } else {
      res.send({ message: "Utilisateur inconnu" });
    }
  });
}
