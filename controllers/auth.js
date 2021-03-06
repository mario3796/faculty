const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/auth/login',
        title: 'Login',
        errorMessage: null,
        validationErrors: [],
            oldInput: {
                email: '',
                pwd: ''
            }
    })
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/auth/signup',
        title: 'Signup',
        errorMessage: null,
        validationErrors: [],
            oldInput: {
                name: '',
                email: '',
                pwd: '',
                confirmPwd: ''
            }
    })
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pwd;
    const confirmPassword = req.body.confirmPwd;
    const imageUrl = req.file ? req.file.path : null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).render('auth/signup', {
            path: '/auth/signup',
            title: 'Signup',
            errorMessage: errors.array()[0].msg,
            validationErrors: validationResult(req).array(),
            oldInput: {
                name: name,
                email: email,
                pwd: password,
                confirmPwd: confirmPassword
            }
        });
    }
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        user.user_type = 'admin';
        user.imageUrl = imageUrl;
        return user.save();
    })
    .then(result => {
        console.log(result);
        res.redirect('/auth/login');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.pwd;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).render('auth/login', {
            path: '/auth/login',
            title: 'Login',
            errorMessage: errors.array()[0].msg,
            validationErrors: validationResult(req).array(),
            oldInput: {
                email: email,
                pwd: password
            }
        });
    }
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            return res.redirect('/auth/login');
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    console.log(req.session);
                    res.redirect('/');
                })
            } else {
                return res.redirect('/auth/login');
            }
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.postLogout = (req, res, next) => {
    return req.session.destroy(err => {
        if (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          }
        return res.redirect('/');
    })
};