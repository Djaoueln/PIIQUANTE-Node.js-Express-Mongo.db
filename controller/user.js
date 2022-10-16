
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../mongo');


//Create user
async function createUserData(req, res) {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
  
  //Create user
    const user = new User({ email, password: hashedPassword});
  
  //Save
    user
    .save()
    .then(() => res.status(201).send({message: "Utilisateur enregistré" }))
    .catch((error) => {res.status(409).send({message: "Utilisateur non enregistré :" + error})});
  }

  //Hash password
  function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  
  //Login
  function loginUser (req, res) {
    const email = req.body.email;
    const password = req.body.password;
     User.findOne({ email }).then(user => {
      console.log(user);
       if (user) {
         bcrypt.compare(password, user.password).then(samePassword => {
           if (samePassword)
             {
               res.status(200).json({ userId: user._id,
               token: jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" }) });
             }
  
           else
             {
              res.status(401).send({ message: "Mot de passe incorrect" });
             } });
             }
          else
          {
             res.status(400).send({ message: "Utilisateur inconnu" });
          }
     });
  }

module.exports = {  createUserData, loginUser };