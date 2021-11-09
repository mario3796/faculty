const express = require("express");

const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const multer = require("multer");

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

const MONGODB_URL =
  "mongodb+srv://Mario:5SooxNnEpX5XvapP@cluster0.e6u5k.mongodb.net/faculty?retryWrites=true&w=majority";

const store = MongoStore.create({
  mongoUrl: MONGODB_URL,
  ttl: 60 * 60,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      [new Date().toISOString().replace(/:/g, '-'), file.originalname].join('-')
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
      cb(null, true);
  } else {
      cb(null, false);
  }
};

app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    res.locals.userType = null;
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      res.locals.userType = user.user_type;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use(errorController.get404);
app.get("/500", errorController.get500);

app.use((error, req, res, next) => {
    console.log(error);
  res.status(500).render("500", {
    path: "/500",
    title: "Error!",
    userType: req.session.user_type,
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    app.listen(3000);
    console.log("Connected!");
  })
  .catch((err) => console.log(err));
