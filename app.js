const express = require("express");

const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose
.connect("mongodb+srv://Mario:5SooxNnEpX5XvapP@cluster0.e6u5k.mongodb.net/faculty?retryWrites=true&w=majority")
.then(result => {
    console.log('Connected!');
})
.catch(err => console.log(err));