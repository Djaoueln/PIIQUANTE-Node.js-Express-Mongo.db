const express = require("express");
const app = express();


// middleware
app.use ((req, res, next) => {
    console.log("Request received");
    next();
});

app.use ((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json( { message :"votre requête a bien été reçue !" });
    next();
});

app.use((req, res, next) => {
    console.log("Response sent successfully");
});



module.exports = app;