
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { json } = require("body-parser");

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true },
});

const Product = mongoose.model("product", sauceSchema);

// display all sauces
function getSauces (req, res) {
    const header = req.headers.authorization.split(" ")[1];
    if (!header) {
        res.status(401).send({ error: "Unauthorized" });
    }
  jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: "Unauthorized" });
    }
    Product.find().then((products) => {
      res.status(200).send(products);
    });
  });

}

// create a sauce
function saucesCreate (req, res) {
  const {body, file} = req;
const sauces = JSON.parse(body.sauce);
const { userId, name, manufacturer, description, mainPepper, heat } = sauces;
const imageUrl = file.destination + file.filename;
delete sauces._id;
delete sauces.userId;
const product = new Product({
        userId,
        name,
        manufacturer,
        description ,
        mainPepper,
        imageUrl: req.protocol + "://" + req.get("host") + "/images/" + file.filename,
        heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    product.save().then((product) => {
        res.status(201).send({ message: product });
    });
}

// selec of a sauce
function sauceById (req, res) {
    const header = req.headers.authorization.split(" ")[1];
    if (!header) {
        res.status(401).send({ error: "Unauthorized" });
    }
  jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: "Unauthorized" });
    }
    Product.findById(req.params.id).then((product) => {
      res.status(200).send(product);
    });
  });
}


// modfication of information of a sauce
function modifySauce (req, res) {
    const header = req.headers.authorization.split(" ")[1];
    if (!header) {
        res.status(401).send({ error: "Unauthorized" });
    }
  jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: "Unauthorized" });
    }
     const sauceProduct = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Product.updateOne({ _id: req.params.id }, { ...sauceProduct, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  });
}



// delete sauce
function deleteSauce (req, res) {
    const header = req.headers.authorization.split(" ")[1];
    if (!header) {
        res.status(401).send({ error: "Unauthorized" });
    }
  jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: "Unauthorized" });
    }
    Product.findByIdAndDelete(req.params.id).then((product) => {
      res.status(200).send({ message: 'Objet supprimé !'});
    });
  });
}

// like/dislike d'une sauce
function likeSauce (req, res) {
    const header = req.headers.authorization.split(" ")[1];
    if (!header) {
        res.status(401).send({ error: "Unauthorized" });
    }
  jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: "Unauthorized" });
    }
    Product.findById(req.params.id).then((product) => {
      if (req.body.like === 1) {
        product.likes += 1;
        product.usersLiked.push(req.body.userId);
      } else if (req.body.like === -1) {
        product.dislikes += 1;
        product.usersDisliked.push(req.body.userId);
      }
      if (req.body.like === 0) {
        if (product.usersLiked.includes(req.body.userId)) {
          product.likes -= 1;
          product.usersLiked.splice(product.usersLiked.indexOf(req.body.userId), 1);
        } else if (product.usersDisliked.includes(req.body.userId)) {
          product.dislikes -= 1;
          product.usersDisliked.splice(product.usersDisliked.indexOf(req.body.userId), 1);
        }
      }
      product.save().then((product) => {
        res.status(200).send({ message: product });
      });
    });
  });
}

module.exports = { getSauces, saucesCreate, sauceById, modifySauce, deleteSauce, likeSauce };
