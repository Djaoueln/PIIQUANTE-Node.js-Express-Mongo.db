const {app, express} = require('./server');
const port = 3000;
const bodyParser = require("body-parser");
const path = require("path");



// controller
const { getSauces, saucesCreate} = require('./controller/sauces');
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

//Listen
app.listen(port, () => console.log("listening on port" + port));
app.use('/images', express.static(path.join(__dirname, 'images')));


