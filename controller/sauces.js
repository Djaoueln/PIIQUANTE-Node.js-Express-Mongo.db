
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

function saucesCreate (req, res) {
  const {body, file} = req;
const sauces = JSON.parse(body.sauce);
delete sauces._id;
delete sauces.userId;
const { userId, name, manufacturer, description, mainPepper, heat } = sauces;
const imageUrl = file.destination + file.filename;
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




module.exports = {getSauces, saucesCreate};