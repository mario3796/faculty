const express = require("express");
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");

const isAuth = require("../middlewares/is-auth");
const isNotAuth = require("../middlewares/is-not-auth");
const User = require("../models/user");

router.get('/login', isNotAuth, authController.getLogin);

router.post('/login', isNotAuth, [
    body('email').notEmpty().isEmail().withMessage('please enter a valid email!')
    .custom((value, {req}) => {
        return User.findOne({email: value})
        .then(user => {
            if (!user) {
                return Promise.reject("invalid email or password!");
            }
        })
    }),
    body('pwd').notEmpty().isLength({min: 5}).withMessage('password must not less 5 characters!')
    .custom((value, {req}) => {
        return User.findOne({email: req.body.email})
        .then(user => {
            return bcrypt.compare(value, user.password)
            .then(doMatch => {
                if (!doMatch) {
                    return Promise.reject("invalid email or password!");
                }
            })
        })
    }),
], authController.postLogin);

router.get('/signup', isNotAuth, authController.getSignup);

router.post('/signup', isNotAuth, [
    body('name').notEmpty().isLength({min: 3}).withMessage('please enter a valid username'),
    body('email').notEmpty().isEmail().withMessage('please enter a valid email!')
    .custom(value => {
        if (value !== 'test@test.com') {
            throw new Error("you are not allowed to sign in!");
        }
        return User.findOne({email: value})
        .then(user => {
            if (user) {
                return Promise.reject("email already exists!");
            }
        })
    }),
    body('pwd').notEmpty().isLength({min: 5}).withMessage('password must not less 5 characters!'),
    body('confirmPwd').custom((value, {req}) => {
        if (value !== req.body.pwd) {
            throw new Error("password and confirm password do not match!");
        }
        return true;
    })

], authController.postSignup);

router.post('/logout', isAuth, authController.postLogout);

module.exports = router;