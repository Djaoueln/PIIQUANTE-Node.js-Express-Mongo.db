const {app, express} = require('./server');
const port = 3000;
const bodyParser = require("body-parser");
const path = require("path");



// controller
const { getSauces, saucesCreate, sauceById, modifySauce, deleteSauce, likeSauce} = require('./controller/sauces');
const { createUserData, loginUser } = require('./controller/user');
const multer = require("./middleware/multer-config");
require("./mongo");

  //Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
 

 // Routes
 app.post("/api/auth/signup", createUserData);
 app.post("/api/auth/login", loginUser);
 app.get("/", (req, res) => res.send("Hello Wordl"));
 app.get("/api/sauces", getSauces);
 app.post("/api/sauces", multer, saucesCreate);
 app.get("/api/sauces/:id", sauceById,);
 app.put("/api/sauces/:id", multer, modifySauce);
 app.delete("/api/sauces/:id", deleteSauce);
 app.post("/api/sauces/:id/like", likeSauce);

//Listen
app.listen(port, () => console.log("listening on port" + port));
app.use('/images', express.static(path.join(__dirname, 'images')));


