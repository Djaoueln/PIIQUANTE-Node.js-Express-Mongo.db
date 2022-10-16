const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

const password = process.env.DB_PASSWORD;
const userName = process.env.DB_USERNAME;
mongoose.connect(`mongodb+srv://${userName}:${password}@cluster0.wgzwom8.mongodb.net/?retryWrites=true&w=majority`).then(() => {console.log('Connexion à MongoDB réussie !')}).catch(() => {console.log('Connexion à MongoDB échouée !')});

//Schema
 const userSchema = mongoose.Schema({
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true }

 });

 //Plugin
 userSchema.plugin(uniqueValidator);

//Model
const User = mongoose.model('User', userSchema);


module.exports = {mongoose, User};