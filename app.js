const express = require("express");

const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const SessionStore = require("express-session")(express);

const userRoutes= require("./routes/user");
const adminRoutes = require("./routes/admin");

const app = express();

const MONGODB_URL = "mongodb+srv://Mario:5SooxNnEpX5XvapP@cluster0.e6u5k.mongodb.net/faculty?retryWrites=true&w=majority";

const store = new SessionStore({
    url: MONGODB_URL,
    interval: 120000
});

app.use(express.session({
    store: store,
    cookie: { maxAge: 900000 }
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(userRoutes);
app.use('/admin', adminRoutes);

mongoose
.connect(MONGODB_URL)
.then(result => {
    app.listen(3000);
    console.log('Connected!');
})
.catch(err => console.log(err));