const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

const isAuth = require("../middlewares/is-auth");
const isNotAuth = require("../middlewares/is-not-auth");

router.get('/login', isNotAuth, authController.getLogin);

router.post('/login', isNotAuth, authController.postLogin);

router.get('/signup', isNotAuth, authController.getSignup);

router.post('/signup', isNotAuth, authController.postSignup);

router.post('/logout', isAuth, authController.postLogout);

module.exports = router;